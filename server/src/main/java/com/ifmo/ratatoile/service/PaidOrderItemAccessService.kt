package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dto.PaidOrderItemDto
import com.ifmo.ratatoile.dto.PaidOrderItemsDto
import com.ifmo.ratatoile.repository.DishRepository
import com.ifmo.ratatoile.repository.GuestCardRepository
import com.ifmo.ratatoile.repository.GuestOrderItemRepository
import com.ifmo.ratatoile.repository.PaidOrderItemRepository
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class PaidOrderItemAccessService(
  private val paidOrderItemRepository: PaidOrderItemRepository,
  private val guestOrderItemRepository: GuestOrderItemRepository,
  private val dishRepository: DishRepository,
  private val guestCardRepository: GuestCardRepository
) {

  fun getPaidOrderItems(): PaidOrderItemsDto {
    return PaidOrderItemsDto(paidOrderItemRepository.findAll()
        .map {
          val orderItem = guestOrderItemRepository.safeFindByIdOrNull(it.orderItemId)
          val dish = dishRepository.safeFindByIdOrNull(orderItem?.dishId)
          val guestCard = guestCardRepository.safeFindByIdOrNull(it.guestCardId)
          PaidOrderItemDto(
              it.id!!,
              orderItem?.guestId,
              if (dish != null) {
                "${dish.id}: ${dish.name}"
              } else "unavailable",
              it.originalPrice.toDouble(),
              it.paidPrice.toDouble(),
              if (guestCard != null) {
                "${guestCard.id}: ${guestCard.fullName}"
              } else "none or removed"
          )
        }
    )
  }

  fun <T, ID> CrudRepository<T, ID>.safeFindByIdOrNull(id: ID): T? {
    if (id == null) return null
    return findByIdOrNull(id)
  }
}