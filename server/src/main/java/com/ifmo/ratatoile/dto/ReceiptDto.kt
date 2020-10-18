package com.ifmo.ratatoile.dto

data class ReceiptDto(
  val totalSum: Double,
  val guests: List<ReceiptPerGuestDto>
)

data class ReceiptPerGuestDto(
  val guestId: Int,
  val positions: List<ReceiptPerGuestPositionDto>,
  val sumPerGuest: Double
)

data class ReceiptWOrderItemDto(
  val totalSum: Double,
  val guests: List<ReceiptPerGuestWOrderItemDto>
)

data class ReceiptPerGuestWOrderItemDto(
  val guestId: Int,
  val positions: List<ReceiptPerGuestPosWOrderItemDto>,
  val sumPerGuest: Double
)

data class ReceiptPerGuestPositionDto(
  val dishName: String,
  val quantity: Int,
  val price: Double,
  val total: Double
)

data class ReceiptPerGuestPosWOrderItemDto(
  val orderItem: GuestOrderItemDto,
  val dishName: String,
  val price: Double
)

