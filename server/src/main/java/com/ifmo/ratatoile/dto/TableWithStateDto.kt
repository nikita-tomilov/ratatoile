package com.ifmo.ratatoile.dto

enum class TableWithStateDtoState {
  FREE, FREE_BUT_BOOKED, SUPPOSED_TO_BE_BUSY, BUSY, BUSY_BY_YOU
}

data class TableWithStateDto(
  val id: Int,
  val guiX: Float,
  val guiY: Float,
  val guiW: Float,
  val guiH: Float,
  val maxSeats: Int,
  val type: String,
  val closestReservations: List<TableReservationDto>,
  val isBusy: Boolean,
  val guests: GuestsDto,
  val state: TableWithStateDtoState
)