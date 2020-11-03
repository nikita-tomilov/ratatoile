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

  @GetMapping("/status/{table_id}")
  fun status(
    @PathVariable("table_id") tableId: Int
  ) = guestService.tableStatus(tableId)

  @GetMapping("/checkout/{table_id}")
  fun checkout(
    @PathVariable("table_id") tableId: Int
  ) = guestService.checkoutTable(tableId)

  @GetMapping("/status/{table_id}/{guest_card_id}")
  fun statusWithGuestCard(
    @PathVariable("table_id") tableId: Int,
    @PathVariable("guest_card_id") guestCardId: Int
  ) = guestService.tableStatus(tableId, guestCardId)

  @GetMapping("/checkout/{table_id}/{guest_card_id}")
  fun checkoutWithGuestCard(
    @PathVariable("table_id") tableId: Int,
    @PathVariable("guest_card_id") guestCardId: Int
  ) = guestService.checkoutTable(tableId, guestCardId)
}