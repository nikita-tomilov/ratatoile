package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Guest
import com.ifmo.ratatoile.dao.GuestOrderItem
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.*
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.repository.EatingTableRepository
import com.ifmo.ratatoile.repository.GuestRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.time.Instant

@Service
class GuestService(
  private val reservationRequestsService: ReservationRequestsService,
  private val eatingTableRepository: EatingTableRepository,
  private val userService: UserService,
  private val dishService: DishService,
  private val guestRepository: GuestRepository,
  private val guestOrderItemService: GuestOrderItemService,
  private val paidOrderItemService: PaidOrderItemService,
  private val guestCardService: GuestCardService
) {

  fun advanceReservationToGuests(reservationId: Int, guestsCount: Int): GuestsDto {
    if (guestsCount <= 0) throw BadRequestException("How are you supposed to have $guestsCount guests?")
    val reservation = reservationRequestsService.getReservation(reservationId)
    return GuestsDto((0 until guestsCount).map {
      val entity = Guest(
          enteredAt = Instant.now(),
          leavedAt = null,
          table = getTableAsEntity(reservation.assignedTableId),
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
          table = getTableAsEntity(tableId),
          waiter = userService.meAsEntity()
      )
      guestRepository.saveAndFlush(entity).toDto()
    })
  }

  private fun getDiscountCoeff(guestCardId: Int?): Double {
    if (guestCardId == null) return 1.0
    val guestCard = guestCardService.getGuestCard(guestCardId)
    return 1.0 - guestCard.percentage.toDouble() / 100
  }

  fun tableStatus(tableId: Int, guestCardId: Int? = null): ReceiptWOrderItemDto {
    val guestsForTable = currentGuestsAsEntities().filter { it.table.id!! == tableId }
    if (guestsForTable.isEmpty()) throw BadRequestException("This table $tableId has no guests")

    val discountCoeff = getDiscountCoeff(guestCardId)

    val receiptsPerGuest = guestsForTable.map {
      val orderItemsPerGuest = guestOrderItemService.findAllByGuestId(it.id!!)
      orderItemsPerGuest
          .toNonFinalReceiptPerGuestDto(
              it.id ?: error("should-never-happen"),
              discountCoeff)
    }

    return ReceiptWOrderItemDto(
        receiptsPerGuest.map { it.sumPerGuest }.sum(),
        receiptsPerGuest.sortedBy { it.guestId })
  }

  fun checkoutTable(tableId: Int, guestCardId: Int? = null): ReceiptDto {
    val guestsForTable = currentGuestsAsEntities().filter { it.table.id!! == tableId }
    if (guestsForTable.isEmpty()) throw BadRequestException("This table $tableId has no guests")

    val discountCoeff = getDiscountCoeff(guestCardId)

    guestsForTable.forEach {
      it.leavedAt = Instant.now()
      guestRepository.saveAndFlush(it)
    }

    guestsForTable.forEach { guest ->
      val orderItemsPerGuest = guestOrderItemService.findAllByGuestId(guest.id!!)
      val served = orderItemsPerGuest.filter { it.wasServed() }
      val notServed = orderItemsPerGuest.filterNot { it.wasServed() }
      paidOrderItemService.registerAsPaid(served, discountCoeff, guestCardId)
      paidOrderItemService.registerAsCancelled(notServed)
    }

    val receiptsPerGuest = guestsForTable.map { guest ->
      val orderItemsPerGuest = guestOrderItemService.findAllByGuestId(guest.id!!)
      orderItemsPerGuest
          .filter { it.wasPaid() }
          .toFinalReceiptPerGuestDtoWithGrouping(
              guest.id ?: error("should-never-happen"),
              discountCoeff)
    }

    return ReceiptDto(
        receiptsPerGuest.map { it.sumPerGuest }.sum(),
        receiptsPerGuest.sortedBy { it.guestId })
  }

  private fun List<GuestOrderItem>.toNonFinalReceiptPerGuestDto(
    guestId: Int,
    discountCoeff: Double
  ): ReceiptPerGuestWOrderItemDto {
    val dishes =
        this.map { it.dishId }.toSet().map { it to dishService.getDishAsEntity(it) }.toMap()
    val positions = this.map {
      val dishId = it.dishId
      val dish = dishes[dishId] ?: error("should-never-happen")
      ReceiptPerGuestPosWOrderItemDto(
          it.toDto(),
          dish.name, dish.price.toDouble())
    }
    return ReceiptPerGuestWOrderItemDto(
        guestId,
        positions.sortedBy { it.orderItem.id },
        positions.map { it.price }.sum() * discountCoeff)
  }

  private fun List<GuestOrderItem>.toFinalReceiptPerGuestDtoWithGrouping(
    guestId: Int,
    discountCoeff: Double
  ): ReceiptPerGuestDto {
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
    return ReceiptPerGuestDto(guestId, positions, positions.map { it.total }.sum() * discountCoeff)
  }

  private fun currentGuestsAsEntities() = guestRepository.findAllByLeavedAtIsNull()

  fun tableIdByGuestId(guestId: Int): Int {
    val guest = guestRepository.findByIdOrNull(guestId)
      ?: throw BadRequestException("No guest for id $guestId")
    return guest.table.id!!
  }

  private fun getTableAsEntity(id: Int) =
      eatingTableRepository.findByIdOrNull(id) ?: throw BadRequestException("no table for id $id")

  private fun GuestOrderItem.wasServed() = (this.getStatusEnum() == GuestOrderItemStatus.SERVED)
  private fun GuestOrderItem.wasPaid() = (this.getStatusEnum() == GuestOrderItemStatus.PAID)
}