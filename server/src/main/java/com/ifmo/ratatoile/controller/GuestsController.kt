package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.GuestService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/api/1.0/guests/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class GuestsController(
  private val guestService: GuestService
) {

  @GetMapping("/create/from/reservation/{reservation_id}/{guests_count}")
  fun newGuestsFromReservation(
    @PathVariable("reservation_id") reservationId: Int,
    @PathVariable("guests_count") guestsCount: Int
  ) = guestService.advanceReservationToGuests(reservationId, guestsCount)

  @GetMapping("/create/{table_id}/{guests_count}")
  fun newGuestsForTable(
    @PathVariable("table_id") tableId: Int,
    @PathVariable("guests_count") guestsCount: Int
  ) = guestService.addGuestsForTable(tableId, guestsCount)

  @GetMapping("/add/dish/{guest_id}/{dish_id}")
  fun addDishToGuest(
    @PathVariable("guest_id") guestId: Int,
    @PathVariable("dish_id") dishId: Int
  ) = guestService.addDishToGuest(guestId, dishId)

  @GetMapping("/checkout/{table_id}")
  fun checkout(
    @PathVariable("table_id") tableId: Int
  ) = guestService.checkoutTable(tableId)
}