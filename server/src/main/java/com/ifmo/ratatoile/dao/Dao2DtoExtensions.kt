package com.ifmo.ratatoile.dao

import com.ifmo.ratatoile.dto.TableDto
import com.ifmo.ratatoile.dto.TableReservationDto

fun Reservation.toDto() = TableReservationDto(
    id!!,
    reservedFrom.toEpochMilli(),
    reservedTo.toEpochMilli(),
    comment,
    personName,
    personPhone,
    table.id!!
)

fun EatingTable.toDto() = TableDto(
    id!!, guiX, guiY, guiW, guiH, maxSeats, type
)