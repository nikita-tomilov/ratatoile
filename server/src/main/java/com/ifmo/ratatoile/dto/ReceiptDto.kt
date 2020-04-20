package com.ifmo.ratatoile.dto

data class ReceiptDto(
  val totalSum: Double,
  val guests: List<ReceiptPerGuestDto>
)

data class ReceiptPerGuestDto(
  val positions: List<ReceiptPerGuestPositionDto>,
  val sumPerGuest: Double
)

data class ReceiptPerGuestPositionDto(
  val dishName: String,
  val quantity: Int,
  val price: Double,
  val total: Double
)

