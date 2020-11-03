package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.GuestOrderItem
import com.ifmo.ratatoile.dao.PaidOrderItem
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.repository.PaidOrderItemRepository
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class PaidOrderItemService(
  private val paidOrderItemRepository: PaidOrderItemRepository,
  private val guestOrderItemService: GuestOrderItemService,
  private val dishService: DishService
) {

  fun registerAsPaid(
    orderItems: List<GuestOrderItem>,
    discountCoeff: Double = 1.0,
    guestCardId: Int?
  ) {
    guestOrderItemService.updateStatus(orderItems, GuestOrderItemStatus.getFinalStatus())
    val paidOrderItems = orderItems.map {
      val dish = dishService.getDish(it.dishId)
      PaidOrderItem(
          orderItemId = it.id ?: error("should-never-happen"),
          originalPrice = BigDecimal.valueOf(dish.price),
          paidPrice = BigDecimal.valueOf(dish.price * discountCoeff),
          guestCardId = guestCardId
      )
    }
    paidOrderItemRepository.saveAll(paidOrderItems)
    paidOrderItemRepository.flush()
  }

  fun registerAsCancelled(orderItems: List<GuestOrderItem>) {
    guestOrderItemService.updateStatus(orderItems, GuestOrderItemStatus.CANCELLED)
  }
}