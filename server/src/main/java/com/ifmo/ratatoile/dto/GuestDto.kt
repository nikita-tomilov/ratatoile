package com.ifmo.ratatoile.dto

class GuestDto(
  val id: Int,
  val enteredAt: Long,
  val leavedAt: Long,
  val tableId: Int,
  val waiterId: Long
)