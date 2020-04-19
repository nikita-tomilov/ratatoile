package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dto.TableReservationRequest
import com.ifmo.ratatoile.dto.TableReservationResponse
import com.ifmo.ratatoile.service.ReservationsService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(
    value = ["/freeapi/1.0/reservation/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class UnprotectedReservationController(
  private val tablesService: ReservationsService
) {

  @PostMapping("/create")
  fun createReservation(@RequestBody request: TableReservationRequest): TableReservationResponse =
      tablesService.createReservation(request)

}