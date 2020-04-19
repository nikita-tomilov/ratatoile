package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.EatingTable
import com.ifmo.ratatoile.dao.Reservation
import com.ifmo.ratatoile.dto.TableReservationRequest
import com.ifmo.ratatoile.dto.TableReservationResponse
import com.ifmo.ratatoile.dto.TableReservationTableType
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.repository.EatingTableRepository
import com.ifmo.ratatoile.repository.ReservationRepository
import mu.KLogging
import org.springframework.stereotype.Service
import java.time.Instant
import javax.annotation.PostConstruct

@Service
class TablesService(
  private val tableRepository: EatingTableRepository,
  private val reservationRepository: ReservationRepository
) {

  @PostConstruct
  fun postConstruct() {
    if (tableRepository.findAll().isEmpty()) {
      logger.warn { "Tables table is empty; generating mock eating tables..." }
      val tables = TableLayoutService.createArrangedTables()
      tables.forEach { tableRepository.saveAndFlush(it) }
    }
  }

  private val reservationMutex = object {}

  fun createReservation(request: TableReservationRequest): TableReservationResponse {
    if (request.from >= request.to) throw BadRequestException("Bad from..to")
    if ((request.seats <= 0) || (request.seats > 12)) throw BadRequestException("Bad amount of seats")
    synchronized(reservationMutex) {
      val reservationFrom = Instant.ofEpochMilli(request.from)
      val reservationTo = Instant.ofEpochMilli(request.to)
      val reservationsWithinRange =
          reservationRepository.findAllWithinTimeRange(reservationFrom, reservationTo)
      val busyTableIds = reservationsWithinRange.map { it.table.id!! }.toSet()
      val availableTables = filterAvailableTables(busyTableIds, request)
      if (availableTables.isEmpty()) {
        throw BadRequestException("No tables match")
      }
      val table = availableTables.random()
      val reservation = Reservation(
          table = table,
          reservedFrom = reservationFrom,
          reservedTo = reservationTo,
          comment = request.comment,
          personName = request.personName,
          personPhone = request.personPhone
      )
      val savedReservation = reservationRepository.saveAndFlush(reservation)
      return TableReservationResponse(
          request.personName,
          request.personPhone,
          "ok; reservation id = ${savedReservation.id!!}")
    }
  }

  private fun filterAvailableTables(
    busyTableIds: Set<Int>,
    request: TableReservationRequest
  ): List<EatingTable> {
    return tableRepository.findAll()
        .asSequence()
        .filter { !busyTableIds.contains(it.id!!) }
        .filter { it.maxSeats >= request.seats }
        .filter {
          when (request.type) {
            TableReservationTableType.NORMAL -> true
            TableReservationTableType.NEAR_WINDOW -> it.isNearWindow()
            TableReservationTableType.NEAR_BAR -> it.isNearBar()
          }
        }
        .toList()
  }

  companion object : KLogging()
}