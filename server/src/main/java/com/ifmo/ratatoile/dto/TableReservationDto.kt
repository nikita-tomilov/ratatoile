package com.ifmo.ratatoile.dto

data class TableReservationDto(
  val id: Int,
  val from: Long,
  val to: Long,
  val comment: String,
  val personName: String,
  val personPhone: String,
  val assignedTableId: Int
)