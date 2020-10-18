package com.ifmo.ratatoile.dto

data class GuestOrderItemDto(
  val id: Int,
  val guestId: Int,
  val dishId: Int,
  val status: GuestOrderItemStatus
)

data class GuestOrderItemsDto(
  val orderItems: List<GuestOrderItemDto>
)

enum class GuestOrderItemStatus {
  AWAITING_FOR_ACCEPTANCE, IN_QUEUE, COOKING, READY, SERVED, PAID;

  companion object {
    fun getInitialStatus(): GuestOrderItemStatus {
      return AWAITING_FOR_ACCEPTANCE
    }

    fun getFinalStatus(): GuestOrderItemStatus {
      return PAID
    }
  }
}