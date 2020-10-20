package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.KitchenQueueEntry
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dao.unbox
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.dto.KitchenQueueDto
import com.ifmo.ratatoile.dto.KitchenQueueEntryDto
import com.ifmo.ratatoile.repository.KitchenQueueRepository
import org.springframework.stereotype.Service

@Service
class KitchenQueueService(
  private val guestOrderItemService: GuestOrderItemService,
  private val guestService: GuestService,
  private val kitchenQueueRepository: KitchenQueueRepository,
  private val userService: UserService
) {

  fun getQueue() = KitchenQueueDto(
      kitchenQueueRepository.findAll()
          .unbox()
          .map { KitchenQueueEntryDto(it.toDto()) })

  //TODO: optimize maybe?
  fun getQueueForWaiter(waiterId: Long): KitchenQueueDto {
    val orderItemsForWaiter = guestOrderItemService.findAllByWaiterId(waiterId)
    return KitchenQueueDto(
        kitchenQueueRepository.findAllByOrderItemIn(orderItemsForWaiter)
            .unbox()
            .map { KitchenQueueEntryDto(it.toDto(), guestService.tableIdByGuestId(it.guestId)) })
  }

  fun getQueueForWaiter() = getQueueForWaiter(userService.myId())

  fun sendToKitchen(guestOrderItemId: Int): KitchenQueueDto {
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, GuestOrderItemStatus.IN_QUEUE)
    val entries = kitchenQueueRepository.findAll().filter { it.orderItem.id == guestOrderItemId }
    if (entries.isEmpty()) {
      kitchenQueueRepository.save(KitchenQueueEntry(null, item))
    }
    return getQueue()
  }

  fun foodIsServed(guestOrderItemId: Int): KitchenQueueDto {
    //TODO: charge the ingredients from the warehouse - they were spent on cooking food
    val entries = kitchenQueueRepository.findAll().filter { it.orderItem.id == guestOrderItemId }
    kitchenQueueRepository.deleteAll(entries)
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, GuestOrderItemStatus.SERVED)
    return getQueue()
  }

  fun updateFoodStatus(guestOrderItemId: Int, status: GuestOrderItemStatus): KitchenQueueDto {
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, status)
    return getQueue()
  }
}