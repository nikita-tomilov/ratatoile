package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.EatingTable
import com.ifmo.ratatoile.dao.Reservation
import com.ifmo.ratatoile.dao.ReservationRequest
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.*
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.ReservationRepository
import com.ifmo.ratatoile.repository.ReservationRequestRepository
import mu.KLogging
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@Service
class ReservationRequestsService(
  private val tableService: EatingTableService,
  private val reservationRepository: ReservationRepository,
  private val reservationRequestRepository: ReservationRequestRepository
) {

  private val reservationMutex = object {}

  fun createReservationRequest(request: TableReservationRequest): TableReservationResponse {
    if (request.from >= request.to) throw BadRequestException("Bad from..to")
    if ((request.seats <= 0) || (request.seats > 12)) throw BadRequestException("Bad amount of seats")
    synchronized(reservationMutex) {
      val rqToStore = ReservationRequest(
          id = null,
          reservedFrom = Instant.ofEpochMilli(request.from),
          reservedTo = Instant.ofEpochMilli(request.to),
          comment = request.comment,
          personName = request.personName,
          personPhone = request.personPhone,
          seats = request.seats,
          tableType = request.type.name
      )
      val saved = reservationRequestRepository.saveAndFlush(rqToStore)
      return TableReservationResponse(
          request.personName,
          request.personPhone,
          "ok; reservation request id = ${saved.id!!}, wait for confirmation")
    }
  }

  fun pickAvailableTable(request: ReservationRequest): EatingTable? {
    val reservationsWithinRange =
        reservationRepository.findAllWithinTimeRange(request.reservedFrom, request.reservedTo)
    val busyTableIds = reservationsWithinRange.map { it.table.id!! }.toSet()
    val availableTables = tableService.filterAvailableTables(busyTableIds, request)
    if (availableTables.isEmpty()) {
      return null
    }
    return availableTables.sortedBy { it.id }.first()
  }

  fun acceptReservationRequest(reservationRqId: Int): TableReservationResponse {
    val request = reservationRequestRepository
        .findByIdOrNull(reservationRqId)
      ?: throw NotFoundException("No reservation rq with id=$reservationRqId")
    val table = pickAvailableTable(request) ?: throw BadRequestException("No tables match")
    val reservation = Reservation(
        table = table,
        reservedFrom = request.reservedFrom,
        reservedTo = request.reservedTo,
        comment = request.comment,
        personName = request.personName,
        personPhone = request.personPhone
    )
    val savedReservation = reservationRepository.saveAndFlush(reservation)
    reservationRequestRepository.deleteById(request.id!!)
    return TableReservationResponse(
        request.personName,
        request.personPhone,
        "ok; reservation id = ${savedReservation.id!!}")
  }

  fun deleteReservationRequest(reservationRqId: Int): TableReservationResponse {
    val request = reservationRequestRepository
        .findByIdOrNull(reservationRqId)
      ?: throw NotFoundException("No reservation rq with id=$reservationRqId")
    reservationRequestRepository.deleteById(request.id!!)
    return TableReservationResponse(
        request.personName,
        request.personPhone,
        "ok; deleted")
  }

  fun getReservationRequests(): TableReservationPendingRequests {
    return TableReservationPendingRequests(reservationRequestRepository.findAll().map {
      TableReservationPendingRequest(
          it.id!!,
          it.personName,
          it.personPhone,
          it.reservedFrom.toEpochMilli(),
          it.reservedTo.toEpochMilli(),
          it.seats,
          it.getTypeEnum(),
          pickAvailableTable(it)?.id
      )
    })
  }

  fun getReservationRequest(id: Int) = reservationRequestRepository.findByIdOrNull(id)

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

  companion object : KLogging()
}