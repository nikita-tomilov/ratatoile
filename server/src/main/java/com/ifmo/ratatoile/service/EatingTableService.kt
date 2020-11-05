package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.EatingTable
import com.ifmo.ratatoile.dao.ReservationRequest
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.*
import com.ifmo.ratatoile.repository.EatingTableRepository
import mu.KLogging
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class EatingTableService(
  private val tableRepository: EatingTableRepository,
  private val reservationAccessService: AcceptedReservationsService,
  private val currentGuestService: CurrentGuestService
) {

  @PostConstruct
  fun postConstruct() {
    if (tableRepository.findAll().isEmpty()) {
      logger.warn { "Tables table is empty; generating mock eating tables..." }
      val tables = TableLayoutService.createArrangedTables()
      tables.forEach { tableRepository.saveAndFlush(it) }
    }
  }

  fun getTables(): TablesDto = TablesDto(tableRepository.findAll().map { it.toDto() })

  private fun getTablesWithReservations(reservations: TableReservationsDto): TablesWithStateDto {
    val reservationsGrouped = reservations.reservations.groupBy { it.assignedTableId }
    val tablesCurrentlyBusy = currentGuestService.currentBusyTables()
    val guestsUnderMyControl = currentGuestService.currentGuestsForCurrentUser()
    return TablesWithStateDto(getTables().tables.map {
      val reservationsForTable = reservationsGrouped[it.id] ?: emptyList()
      val reservedNow = reservationsForTable
          .firstOrNull {
            (it.from <= System.currentTimeMillis()) &&
                (it.to >= System.currentTimeMillis())
          } != null
      val tableCurrentlyBusy = tablesCurrentlyBusy.contains(it.id)
      val guestsForTable = guestsUnderMyControl[it.id] ?: GuestsDto(emptyList())
      val state = when {
        tableCurrentlyBusy && guestsForTable.guests.isNotEmpty() -> TableWithStateDtoState.BUSY_BY_YOU
        tableCurrentlyBusy && guestsForTable.guests.isEmpty() -> TableWithStateDtoState.BUSY
        reservedNow -> TableWithStateDtoState.SUPPOSED_TO_BE_BUSY
        reservationsForTable.isNotEmpty() -> TableWithStateDtoState.FREE_BUT_BOOKED
        else -> TableWithStateDtoState.FREE
      }
      TableWithStateDto(
          it.id,
          it.guiX,
          it.guiY,
          it.guiW,
          it.guiH,
          it.maxSeats,
          it.type,
          reservationsForTable,
          tableCurrentlyBusy,
          guestsForTable,
          state)
    })
  }

  fun getTablesWithReservations(): TablesWithStateDto {
    val allReservations = reservationAccessService.getActiveReservations()
    return getTablesWithReservations(allReservations)
  }

  fun getTablesWithReservationsForToday(): TablesWithStateDto {
    val reservationsForToday = reservationAccessService.getReservationsForToday()
    return getTablesWithReservations(reservationsForToday)
  }

  fun filterAvailableTables(
    busyTableIds: Set<Int>,
    request: ReservationRequest
  ): List<EatingTable> {
    return tableRepository.findAll()
        .asSequence()
        .sortedBy { it.id }
        .filter { !busyTableIds.contains(it.id!!) }
        .filter { it.maxSeats >= request.seats }
        .filter {
          when (request.getTypeEnum()) {
            TableReservationTableType.NORMAL -> true
            TableReservationTableType.NEAR_WINDOW -> it.isNearWindow()
            TableReservationTableType.NEAR_BAR -> it.isNearBar()
          }
        }
        .toList()
  }

  companion object : KLogging()
}