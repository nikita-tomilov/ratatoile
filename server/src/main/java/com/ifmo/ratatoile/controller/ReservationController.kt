package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.AcceptedReservationsService
import com.ifmo.ratatoile.service.ReservationRequestsService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/reservation/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class ReservationController(
  private val reservationRequestsService: ReservationRequestsService,
  private val reservationsAccessService: AcceptedReservationsService
) {

  @GetMapping("/get/all")
  fun getAllReservations() = reservationsAccessService.getReservations()

  @GetMapping("/get/all/for/today")
  fun getAllReservationsForToday() = reservationsAccessService.getReservationsForToday()

  @GetMapping("/get/{id}")
  fun getReservation(@PathVariable("id") id: Int) = reservationRequestsService.getReservation(id)

  @DeleteMapping("/delete/{id}")
  fun deleteReservation(@PathVariable("id") id: Int) = reservationRequestsService.deleteReservation(id)
}