package com.ifmo.ratatoile.dto

data class TableReservationPendingRequests(
  val requests: List<TableReservationPendingRequest>
)

data class TableReservationPendingRequest(
  val id: Int,
  val name: String,
  val phone: String,
  val from: Long,
  val to: Long,
  val seats: Int,
  val tableType: TableReservationTableType,
  val tableCandidateId: Int?
)