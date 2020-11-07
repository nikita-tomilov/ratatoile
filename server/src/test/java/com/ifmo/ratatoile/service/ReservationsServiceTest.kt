package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dto.TableReservationRequest
import com.ifmo.ratatoile.dto.TableReservationTableType
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.repository.EatingTableRepository
import com.ifmo.ratatoile.repository.ReservationRepository
import com.ifmo.ratatoile.repository.ReservationRequestRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import java.time.Duration
import java.time.Instant

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
class ReservationsServiceTest() {

  @Autowired
  lateinit var reservationRequestsService: ReservationRequestsService

  @Autowired
  lateinit var acceptedReservationsService: AcceptedReservationsService

  @Autowired
  lateinit var reservationRequestsRepository: ReservationRequestRepository

  @Autowired
  lateinit var reservationsRepository: ReservationRepository

  @Autowired
  lateinit var eatingTableRepository: EatingTableRepository

  @BeforeEach
  fun cleanup() {
    reservationRequestsRepository.deleteAll()
    reservationRequestsRepository.flush()
    reservationsRepository.deleteAll()
    reservationsRepository.flush()
  }

  @Test
  fun `handles common reservation request errors`() {
    val rq1 = TableReservationRequest(100, 0, 1, TableReservationTableType.NORMAL, "", "", "")
    val rq2 = TableReservationRequest(0, 100, -5, TableReservationTableType.NORMAL, "", "", "")
    val rq3 = TableReservationRequest(0, 100, 15, TableReservationTableType.NORMAL, "", "", "")
    assertThrows<BadRequestException> { reservationRequestsService.createReservationRequest(rq1) }
    assertThrows<BadRequestException> { reservationRequestsService.createReservationRequest(rq2) }
    assertThrows<BadRequestException> { reservationRequestsService.createReservationRequest(rq3) }
  }

  @Test
  fun `can add reservation request`() {
    //given
    val from = System.currentTimeMillis() + Duration.ofDays(1).toMillis()
    val rq1 = TableReservationRequest(from, from + 100, 12, TableReservationTableType.NORMAL, "", "", "")
    //when
    val rp = reservationRequestsService.createReservationRequest(rq1)
    //then
    assertThat(rp.message).isNotEmpty()
  }

  @Test
  fun `can advance reservation request to a reservation`() {
    //given
    val from = System.currentTimeMillis() + Duration.ofDays(1).toMillis()
    val trq = TableReservationRequest(from, from + 100, 12, TableReservationTableType.NORMAL, "", "", "")
    reservationRequestsService.createReservationRequest(trq)
    val request = reservationRequestsService.getReservationRequests().requests.first()
    //when
    reservationRequestsService.acceptReservationRequest(request.id)
    //then
    assertThat(reservationRequestsService.getReservationRequests().requests).isEmpty()
    assertThat(acceptedReservationsService.getActiveReservations().reservations).hasSize(1)
  }

  @Test
  fun `can add reservation request if no suitable tables available and the service knows that`() {
    //given
    val from = System.currentTimeMillis() + Duration.ofDays(1).toMillis()
    makeBigTablesBusy()
    //when
    val trq = TableReservationRequest(from, from + 100, 12, TableReservationTableType.NORMAL, "", "", "")
    reservationRequestsService.createReservationRequest(trq)
    val request = reservationRequestsService.getReservationRequests().requests.first()
    //then
    assertThat(reservationRequestsService.getReservationRequests().requests).hasSize(1)

    //when
    val requestDao =
        reservationRequestsService.getReservationRequest(request.id) ?: error("no rq in db")
    //then
    assertThat(reservationRequestsService.pickAvailableTable(requestDao)).isNull()
  }

  @Test
  fun `cannot advance reservation request to reservation if no suitable tables available`() {
    //given
    `can add reservation request if no suitable tables available and the service knows that`()
    //when
    val request = reservationRequestsService.getReservationRequests().requests.first()
    //then
    assertThrows<BadRequestException> { reservationRequestsService.acceptReservationRequest(request.id) }
  }

  @Test
  fun `can add reservation if no suitable tables available now but available later`() {
    //given
    makeBigTablesBusy()
    val from = System.currentTimeMillis() + Duration.ofDays(2).toMillis()
    //when
    val trq = TableReservationRequest(from, from + 100, 12, TableReservationTableType.NORMAL, "", "", "")
    reservationRequestsService.createReservationRequest(trq)
    val request = reservationRequestsService.getReservationRequests().requests.first()
    //then
    assertThat(reservationRequestsService.getReservationRequests().requests).hasSize(1)

    //when
    reservationRequestsService.acceptReservationRequest(request.id)
    //then
    assertThat(reservationRequestsService.getReservationRequests().requests).hasSize(0)
    assertThat(acceptedReservationsService.getActiveReservations().reservations).hasSize(3)
  }

  @Test
  fun `reservation request has relatively fixed assigned table`() {
    //given
    val from = System.currentTimeMillis() + Duration.ofDays(1).toMillis()
    val rq1 = TableReservationRequest(from, from + 100, 12, TableReservationTableType.NORMAL, "", "", "")
    //when
    val rp = reservationRequestsService.createReservationRequest(rq1)
    //then
    val all1 = reservationRequestsService.getReservationRequests().requests.single()
    (0..100).forEach { _ ->
      val all2 = reservationRequestsService.getReservationRequests().requests.single()
      assertThat(all1.tableCandidateId).isEqualTo(all2.tableCandidateId)
    }
  }

  @Test
  fun `get reservations for today works correctly`() {
    //given
    val now = Instant.now()
    val dates = listOf(
        now.minus(Duration.ofDays(1)).toEpochMilli(),
        now.toEpochMilli(),
        now.plus(Duration.ofDays(1)).toEpochMilli()
    )
    //when
    dates.forEach {
      val trq = TableReservationRequest(it, it + 100, 12, TableReservationTableType.NORMAL, "", "", "")
      reservationRequestsService.createReservationRequest(trq)
      val request = reservationRequestsService.getReservationRequests().requests.first()
      reservationRequestsService.acceptReservationRequest(request.id)
    }

    //then
    assertThat(reservationRequestsService.getReservationRequests().requests).hasSize(0)
    assertThat(acceptedReservationsService.getActiveReservations().reservations).hasSize(1)
    assertThat(acceptedReservationsService.getAllReservations().reservations).hasSize(3)
    assertThat(acceptedReservationsService.getReservationsForToday().reservations).hasSize(1)
  }

  private fun makeBigTablesBusy() {
    val from = System.currentTimeMillis() + Duration.ofDays(1).toMillis()
    eatingTableRepository.findAll().filter { it.maxSeats == 12 }.forEach { _ ->
      val trq = TableReservationRequest(from, from + 100, 12, TableReservationTableType.NORMAL, "", "", "")
      reservationRequestsService.createReservationRequest(trq)
      val request =
          reservationRequestsService.getReservationRequests().requests.maxBy { it.id }!!
      reservationRequestsService.acceptReservationRequest(request.id)
    }
  }
}