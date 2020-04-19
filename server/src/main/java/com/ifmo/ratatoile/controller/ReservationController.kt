package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.ReservationsService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/reservation/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class ReservationController(
  private val reservationsService: ReservationsService
) {

  @GetMapping("/get/all")
  fun getAllReservations() = reservationsService.getReservations()

  @GetMapping("/get/all/for/today")
  fun getAllReservationsForToday() = reservationsService.getReservationsForToday()

  @GetMapping("/get/{id}")
  fun getReservation(@PathVariable("id") id: Int) = reservationsService.getReservation(id)

  @DeleteMapping("/delete/{id}")
  fun deleteReservation(@PathVariable("id") id: Int) = reservationsService.deleteReservation(id)
}