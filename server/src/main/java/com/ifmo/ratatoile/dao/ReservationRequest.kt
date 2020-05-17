package com.ifmo.ratatoile.dao

import com.ifmo.ratatoile.dto.TableReservationTableType
import java.time.Instant
import javax.persistence.*

@Entity
@Table(name = "reservation_request")
data class ReservationRequest(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val reservedFrom: Instant,

  @Column(nullable = false)
  val reservedTo: Instant,

  @Column(nullable = false)
  val comment: String,

  @Column(nullable = false)
  val personName: String,

  @Column(nullable = false)
  val personPhone: String,

  @Column(nullable = false)
  val seats: Int,

  @Column(nullable = false)
  val tableType: String
) {
  fun getTypeEnum(): TableReservationTableType = TableReservationTableType.valueOf(tableType)
}