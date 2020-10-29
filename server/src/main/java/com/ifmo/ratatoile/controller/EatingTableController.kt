package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.EatingTableService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/table/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class EatingTableController(
  private val tablesService: EatingTableService
) {

  @GetMapping("/get/all")
  fun getAllTables() = tablesService.getTables()

  @GetMapping("/get/all/with/reservations")
  fun getAllTablesWithReservations() = tablesService.getTablesWithReservations()

  @GetMapping("/get/all/with/reservations/for/today")
  fun getAllTablesWithReservationsForToday() = tablesService.getTablesWithReservationsForToday()
}