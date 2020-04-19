package com.ifmo.ratatoile.dto

enum class TableReservationTableType {
  NORMAL, NEAR_WINDOW, NEAR_BAR
}

data class TableReservationRequest(
  val from: Long,
  val to: Long,
  val seats: Int,
  val type: TableReservationTableType,
  val comment: String,
  val personName: String,
  val personPhone: String
)