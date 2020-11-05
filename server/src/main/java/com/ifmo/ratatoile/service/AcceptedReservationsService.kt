package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.TableReservationsDto
import com.ifmo.ratatoile.repository.ReservationRepository
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@Service
class AcceptedReservationsService(
  private val reservationRepository: ReservationRepository
) {

  fun getAllReservations(): TableReservationsDto {
    return TableReservationsDto(
        reservationRepository.findAll()
            .sortedBy { it.reservedFrom }
            .map { it.toDto() })
  }

  fun getActiveReservations(): TableReservationsDto {
    return TableReservationsDto(
        reservationRepository.findAll()
            .sortedBy { it.reservedFrom }
            .filter { it.reservedFrom.isAfter(Instant.now()) }
            .map { it.toDto() })
  }

  fun getReservationsForToday(): TableReservationsDto {
    //working hours: 12.00 of current day - 03.00 of next day
    return TableReservationsDto(reservationRepository.findAllWithinTimeRange(
        LocalDate.now().atStartOfDay().toInstant(ZoneOffset.UTC),
        LocalDate.now().atStartOfDay().plusDays(1).plusHours(3).toInstant(ZoneOffset.UTC)
    ).sortedBy { it.reservedFrom }.map { it.toDto() })
  }

}