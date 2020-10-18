package com.ifmo.ratatoile.dto

data class GuestOrderItemDto(
  val id: Int,
  val guestId: Int,
  val dishId: Int
)

data class GuestOrderItemsDto(
  val orderItems: List<GuestOrderItemDto>
)