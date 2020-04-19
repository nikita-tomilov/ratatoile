package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.EatingTable
import com.ifmo.ratatoile.dao.Reservation
import com.ifmo.ratatoile.dto.TableReservationRequest
import com.ifmo.ratatoile.dto.TableReservationTableType
import com.ifmo.ratatoile.exception.BadRequestException
import io.mockk.every
import io.mockk.mockk
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.Instant

class TablesServiceTest() {

  @Test
  fun `reservations seems to work OK`() {
    //given
    val knownReservations = ArrayList<Reservation>()
    val service = TablesService(
        mockk {
          every { findAll() } returns (0 until 2).map {
            EatingTable(it, 0.0f, 0.0f, 0.0f, 0.0f, 2, "")
          }
        },
        mockk {
          every { findAllWithinTimeRange(any(), any()) } answers {
            val from = (it.invocation.args[0] as Instant).toEpochMilli()
            val to = (it.invocation.args[1] as Instant).toEpochMilli()
            knownReservations.filter { r ->
              ((r.reservedFrom.toEpochMilli() >= from) &&
                  (r.reservedFrom.toEpochMilli() <= to)) ||
                  ((r.reservedTo.toEpochMilli() >= from) &&
                      (r.reservedTo.toEpochMilli() <= to)) ||
                  ((r.reservedFrom.toEpochMilli() <= from) &&
                      (r.reservedTo.toEpochMilli() >= to))
            }
          }
          every { saveAndFlush(ofType(Reservation::class)) } answers {
            val r = it.invocation.args[0] as Reservation
            val new = r.copy(id = knownReservations.size)
            knownReservations.add(new)
            new
          }
        }
    )
    //when
    val rq1 = TableReservationRequest(0, 100, 1, TableReservationTableType.NORMAL, "", "", "")
    val rq2 = TableReservationRequest(5, 65, 1, TableReservationTableType.NORMAL, "", "", "")
    service.createReservation(rq1)
    service.createReservation(rq2)
    //then
    assertThat(knownReservations).hasSize(2)
    val r1 = knownReservations[0]
    val r2 = knownReservations[1]
    assertThat(r1.table.id).isNotEqualTo(r2.table.id)
    //when
    val rq3 = TableReservationRequest(0, 100, 1, TableReservationTableType.NORMAL, "", "", "")
    val rq4 = TableReservationRequest(101, 202, 1, TableReservationTableType.NORMAL, "", "", "")
    assertThrows<BadRequestException> { service.createReservation(rq3) }
    service.createReservation(rq4)
    //then
    assertThat(knownReservations).hasSize(3)
  }
}