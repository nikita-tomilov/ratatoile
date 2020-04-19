package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.EatingTable
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.*
import com.ifmo.ratatoile.repository.EatingTableRepository
import mu.KLogging
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import javax.annotation.PostConstruct

@Service
class EatingTableService(
  private val tableRepository: EatingTableRepository
) {

  @Autowired
  lateinit var reservationsService: ReservationsService

  @PostConstruct
  fun postConstruct() {
    if (tableRepository.findAll().isEmpty()) {
      logger.warn { "Tables table is empty; generating mock eating tables..." }
      val tables = TableLayoutService.createArrangedTables()
      tables.forEach { tableRepository.saveAndFlush(it) }
    }
  }

  fun getTables(): TablesDto = TablesDto(tableRepository.findAll().map { it.toDto() })

  private fun getTablesWithReservations(reservations: TableReservationsDto): TablesWithClosestReservationsDto {
    val reservationsGrouped = reservations.reservations.groupBy { it.assignedTableId }
    return TablesWithClosestReservationsDto(getTables().tables.map {
      TableWithClosestReservationsDto(
          it.id,
          it.guiX,
          it.guiY,
          it.guiW,
          it.guiH,
          it.maxSeats,
          it.type,
          reservationsGrouped[it.id] ?: emptyList())
    })
  }

  fun getTablesWithReservations(): TablesWithClosestReservationsDto {
    val allReservations = reservationsService.getReservations()
    return getTablesWithReservations(allReservations)
  }

  fun getTablesWithReservationsForToday(): TablesWithClosestReservationsDto {
    val reservationsForToday = reservationsService.getReservationsForToday()
    return getTablesWithReservations(reservationsForToday)
  }

  fun filterAvailableTables(
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