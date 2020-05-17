package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.ReservationsService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/reservationrequests/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class ReservationPendingRequestsController(
  private val reservationsService: ReservationsService
) {

  @GetMapping("/get")
  fun getAllReservations() = reservationsService.getReservationRequests()

  @GetMapping("/accept/{id}")
  fun getReservation(@PathVariable("id") id: Int) =
      reservationsService.acceptReservationRequest(id)

  @DeleteMapping("/delete/{id}")
  fun deleteReservation(@PathVariable("id") id: Int) =
      reservationsService.deleteReservationRequest(id)
}