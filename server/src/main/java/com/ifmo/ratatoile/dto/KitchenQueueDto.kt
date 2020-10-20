package com.ifmo.ratatoile.dto

data class KitchenQueueDto(
  val items: List<KitchenQueueEntryDto>
)

data class KitchenQueueEntryDto(
  val entry: GuestOrderItemDto,
  val tableId: Int = -1
)
