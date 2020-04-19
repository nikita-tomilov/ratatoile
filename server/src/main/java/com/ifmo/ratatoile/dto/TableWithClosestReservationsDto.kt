package com.ifmo.ratatoile.dto

data class TableWithClosestReservationsDto(
  val id: Int,
  val guiX: Float,
  val guiY: Float,
  val guiW: Float,
  val guiH: Float,
  val maxSeats: Int,
  val type: String,
  val closestReservations: List<TableReservationDto>
)