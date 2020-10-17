package com.ifmo.ratatoile.dto

data class GuestCardDtos(
  val cards: List<GuestCardDto>
)

data class GuestCardDto(
  val id: Int,
  val fullName: String,
  val phone: String,
  val birthday: Long
)

data class GuestCardRequestDto(
  val fullName: String,
  val phone: String,
  val birthday: Long
)