package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.GuestOrderItem
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.dto.GuestOrderItemsDto
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.repository.GuestOrderItemRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class GuestOrderItemService(
  private val guestOrderItemRepository: GuestOrderItemRepository
) {

  fun updateStatus(item: GuestOrderItem, status: GuestOrderItemStatus) {
    item.setStatusEnum(status)
    guestOrderItemRepository.save(item)
  }

  fun updateStatus(items: List<GuestOrderItem>, status: GuestOrderItemStatus) {
    items.forEach { it.setStatusEnum(status) }
    guestOrderItemRepository.saveAll(items)
  }

  fun addDishToGuest(guestId: Int, dishId: Int): GuestOrderItemsDto {
    val orderItem =
        GuestOrderItem(null, guestId, dishId, GuestOrderItemStatus.getInitialStatus().name)
    guestOrderItemRepository.saveAndFlush(orderItem)

    val orderItemsPerGuest = guestOrderItemRepository.findAllByGuestId(guestId)
    return orderItemsPerGuest.toDto()
  }

  fun findById(guestOrderItemId: Int): GuestOrderItem {
    return guestOrderItemRepository.findByIdOrNull(guestOrderItemId)
      ?: throw BadRequestException("No order entry id $guestOrderItemId")
  }

  fun rmDishFromGuest(guestOrderItemId: Int): GuestOrderItemsDto {
    val orderItem = findById(guestOrderItemId)
    guestOrderItemRepository.delete(orderItem)

    val orderItemsPerGuest = guestOrderItemRepository.findAllByGuestId(orderItem.guestId)
    return orderItemsPerGuest.toDto()
  }

  fun findAllByGuestId(guestId: Int) = guestOrderItemRepository.findAllByGuestId(guestId)

  fun findAllByWaiterId(waiterId: Long) = guestOrderItemRepository.findForWaiter(waiterId)
}