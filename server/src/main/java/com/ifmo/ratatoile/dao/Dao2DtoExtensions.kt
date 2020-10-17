package com.ifmo.ratatoile.dao

import com.ifmo.ratatoile.dto.*

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

fun Guest.toDto() = GuestDto(
    id!!,
    enteredAt.toEpochMilli(),
    leavedAt?.toEpochMilli() ?: 0L,
    table.id!!,
    waiter.id!!)

fun Dish.toDto() = DishDto(id!!, name, description, price.toDouble())

fun Ingredient.toDto() = IngredientDto(id!!, name)

fun CriticDonation.toDto() =
    CriticDonationDto(id!!, amount, criticName, reason, date.toEpochMilli())

fun InspectorDonation.toDto() = InspectorDonationDto(id!!, amount, reason, date.toEpochMilli())

fun GuestCard.toDto() = GuestCardDto(id!!, fullName, phone, birthday.toEpochMilli())