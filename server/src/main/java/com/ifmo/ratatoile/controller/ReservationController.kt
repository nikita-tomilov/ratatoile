package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.ReservationAccessService
import com.ifmo.ratatoile.service.ReservationsService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/reservation/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class ReservationController(
  private val reservationsService: ReservationsService,
  private val reservationsAccessService: ReservationAccessService
) {

  @GetMapping("/get/all")
  fun getAllReservations() = reservationsAccessService.getReservations()

  @GetMapping("/get/all/for/today")
  fun getAllReservationsForToday() = reservationsAccessService.getReservationsForToday()

  @GetMapping("/get/{id}")
  fun getReservation(@PathVariable("id") id: Int) = reservationsService.getReservation(id)

  @DeleteMapping("/delete/{id}")
  fun deleteReservation(@PathVariable("id") id: Int) = reservationsService.deleteReservation(id)
}