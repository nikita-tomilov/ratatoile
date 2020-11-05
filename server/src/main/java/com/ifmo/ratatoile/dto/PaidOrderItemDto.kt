package com.ifmo.ratatoile.dto

data class PaidOrderItemDto(
  val id: Int,
  val guestId: Int?,
  val dish: String,
  val originalPrice: Double,
  val paidPrice: Double,
  val guestCard: String
)

data class PaidOrderItemsDto(
  val orderItems: List<PaidOrderItemDto>
)