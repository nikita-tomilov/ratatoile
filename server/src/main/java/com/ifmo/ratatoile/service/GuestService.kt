package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Guest
import com.ifmo.ratatoile.dao.GuestOrderItem
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.*
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.repository.GuestOrderItemRepository
import com.ifmo.ratatoile.repository.GuestRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.Instant

@Service
class GuestService(
  private val reservationsService: ReservationsService,
  private val eatingTableService: EatingTableService,
  private val userService: UserService,
  private val dishService: DishService,
  private val guestRepository: GuestRepository,
  private val orderItemRepository: GuestOrderItemRepository
) {

  fun advanceReservationToGuests(reservationId: Int, guestsCount: Int): GuestsDto {
    if (guestsCount <= 0) throw BadRequestException("How are you supposed to have $guestsCount guests?")
    val reservation = reservationsService.getReservation(reservationId)
    return GuestsDto((0 until guestsCount).map {
      val entity = Guest(
          enteredAt = Instant.now(),
          leavedAt = null,
          table = eatingTableService.getTableAsEntity(reservation.assignedTableId),
          waiter = userService.meAsEntity()
      )
      guestRepository.saveAndFlush(entity).toDto()
    })
  }

  fun addGuestsForTable(tableId: Int, guestsCount: Int): GuestsDto {
    if (guestsCount <= 0) throw BadRequestException("How are you supposed to have $guestsCount guests?")
    return GuestsDto((0 until guestsCount).map {
      val entity = Guest(
          enteredAt = Instant.now(),
          leavedAt = null,
          table = eatingTableService.getTableAsEntity(tableId),
          waiter = userService.meAsEntity()
      )
      guestRepository.saveAndFlush(entity).toDto()
    })
  }

  fun addDishToGuest(guestId: Int, dishId: Int): GuestOrderItemsDto {
    val orderItem =
        GuestOrderItem(null, guestId, dishId, GuestOrderItemStatus.getInitialStatus().name)
    orderItemRepository.saveAndFlush(orderItem)

    val orderItemsPerGuest = orderItemRepository.findAllByGuestId(guestId)
    return GuestOrderItemsDto(orderItemsPerGuest.map { it.toDto() })
  }

  fun rmDishFromGuest(orderEntryId: Int): GuestOrderItemsDto {
    val orderItem = orderItemRepository.findByIdOrNull(orderEntryId)
      ?: throw BadRequestException("No order entry id $orderEntryId")
    orderItemRepository.delete(orderItem)

    val orderItemsPerGuest = orderItemRepository.findAllByGuestId(orderItem.guestId)
    return GuestOrderItemsDto(orderItemsPerGuest.map { it.toDto() })
  }

  fun tableStatus(tableId: Int): ReceiptWOrderItemDto {
    val guestsForTable = currentGuestsAsEntities().filter { it.table.id!! == tableId }
    if (guestsForTable.isEmpty()) throw BadRequestException("This table $tableId has no guests")

    val receiptsPerGuest = guestsForTable.map {
      val orderItemsPerGuest = orderItemRepository.findAllByGuestId(it.id!!)
      orderItemsPerGuest.toReceiptPerGuestDto(it.id ?: error("should-never-happen"))
    }

    return ReceiptWOrderItemDto(receiptsPerGuest.map { it.sumPerGuest }.sum(), receiptsPerGuest.sortedBy { it.guestId })
  }

  fun checkoutTable(tableId: Int): ReceiptDto {
    val guestsForTable = currentGuestsAsEntities().filter { it.table.id!! == tableId }
    if (guestsForTable.isEmpty()) throw BadRequestException("This table $tableId has no guests")

    guestsForTable.forEach {
      it.leavedAt = Instant.now()
      guestRepository.saveAndFlush(it)
    }

    guestsForTable.forEach { guest ->
      val orderItemsPerGuest = orderItemRepository.findAllByGuestId(guest.id!!)
      orderItemsPerGuest.forEach { it.status = GuestOrderItemStatus.getFinalStatus().name }
      orderItemRepository.saveAll(orderItemsPerGuest)
    }

    val receiptsPerGuest = guestsForTable.map {
      val orderItemsPerGuest = orderItemRepository.findAllByGuestId(it.id!!)
      orderItemsPerGuest.toReceiptPerGuestDtoWithGrouping(it.id ?: error("should-never-happen"))
    }

    return ReceiptDto(receiptsPerGuest.map { it.sumPerGuest }.sum(), receiptsPerGuest.sortedBy { it.guestId })
  }

  private fun List<GuestOrderItem>.toReceiptPerGuestDto(guestId: Int): ReceiptPerGuestWOrderItemDto {
    val dishes =
        this.map { it.dishId }.toSet().map { it to dishService.getDishAsEntity(it) }.toMap()
    val positions = this.map {
      val dishId = it.dishId
      val dish = dishes[dishId] ?: error("should-never-happen")
      ReceiptPerGuestPosWOrderItemDto(
          it.toDto(),
          dish.name, dish.price.toDouble())
    }
    return ReceiptPerGuestWOrderItemDto(guestId, positions, positions.map { it.price }.sum())
  }

  private fun List<GuestOrderItem>.toReceiptPerGuestDtoWithGrouping(guestId: Int): ReceiptPerGuestDto {
    val dishes =
        this.map { it.dishId }.toSet().map { it to dishService.getDishAsEntity(it) }.toMap()
    val positionsGroupedByDish = this.groupBy { it.dishId }
    val positions = positionsGroupedByDish.map {
      val dishId = it.key
      val items = it.value
      val dish = dishes[dishId] ?: error("should-never-happen")
      ReceiptPerGuestPositionDto(
          dish.name, items.size, dish.price.toDouble(), dish.price.multiply(
          BigDecimal(items.size)).toDouble())
    }
    return ReceiptPerGuestDto(guestId, positions, positions.map { it.total }.sum())
  }

  private fun currentGuestsAsEntities() = guestRepository.findAllByLeavedAtIsNull()

  private fun currentGuests(): GuestsDto =
      GuestsDto(guestRepository.findAllByLeavedAtIsNull().map { it.toDto() })

  fun currentBusyTables(): Set<Int> = currentGuests().guests.map { it.tableId }.toSet()

  fun currentGuestsForCurrentUser(): Map<Int, GuestsDto> {
    val me = userService.myId()
    val filterPredicate: (GuestDto) -> Boolean = if (userService.IAmAdmin()) {
      { true }
    } else {
      { it.waiterId == me }
    }
    return currentGuests().guests
        .filter(filterPredicate)
        .groupBy { it.tableId }
        .mapValues { GuestsDto(it.value) }
  }
}