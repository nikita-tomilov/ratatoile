package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Reservation
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.TableReservationDto
import com.ifmo.ratatoile.dto.TableReservationRequest
import com.ifmo.ratatoile.dto.TableReservationResponse
import com.ifmo.ratatoile.dto.TableReservationsDto
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.ReservationRepository
import mu.KLogging
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@Service
class ReservationsService(
  private val tableService: EatingTableService,
  private val reservationRepository: ReservationRepository
) {

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
      val availableTables = tableService.filterAvailableTables(busyTableIds, request)
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

  fun getReservations(): TableReservationsDto {
    return TableReservationsDto(reservationRepository.findAll().sortedBy { it.reservedFrom }.map { it.toDto() })
  }

  fun getReservation(id: Int): TableReservationDto {
    return reservationRepository.findByIdOrNull(id)?.toDto()
      ?: throw NotFoundException("no reservation for id $id")
  }

  fun deleteReservation(id: Int): TableReservationDto {
    val res = reservationRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no reservation for id $id")
    reservationRepository.delete(res)
    return res.toDto()
  }

  fun getReservationsForToday(): TableReservationsDto {
    //working hours: 12.00 of current day - 03.00 of next day
    return TableReservationsDto(reservationRepository.findAllWithinTimeRange(
        LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.now().atStartOfDay().plusDays(1).plusHours(3).toInstant(ZoneOffset.UTC)
    ).sortedBy { it.reservedFrom }.map { it.toDto() })
  }

  companion object : KLogging()
}