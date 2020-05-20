package com.ifmo.ratatoile.dto

data class CriticDonationsDto(
  val donations: List<CriticDonationDto>
)

data class CriticDonationDto(
  val id: Int,
  val amount: Int,
  val criticName: String,
  val reason: String,
  val date: Long
)

data class CriticDonationRequestDto(
  val amount: Int,
  val criticName: String,
  val reason: String,
  val date: Long
)

data class InspectorDonationsDto(
  val donations: List<InspectorDonationDto>
)

data class InspectorDonationDto(
  val id: Int,
  val amount: Int,
  val reason: String,
  val date: Long
)

data class InspectorDonationRequestDto(
  val amount: Int,
  val reason: String,
  val date: Long
)