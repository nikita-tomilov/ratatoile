package com.ifmo.ratatoile.dto

data class TableDto(
  val id: Int,
  val guiX: Float,
  val guiY: Float,
  val guiW: Float,
  val guiH: Float,
  val maxSeats: Int,
  val type: String
)