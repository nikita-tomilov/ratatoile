package com.ifmo.ratatoile.dao

import java.time.Instant
import javax.persistence.*

@Entity
@Table(name = "reservation")
data class Reservation(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "table_id", nullable = false)
  val table: EatingTable,

  @Column(nullable = false)
  val reservedFrom: Instant,

  @Column(nullable = false)
  val reservedTo: Instant,

  @Column(nullable = false)
  val comment: String,

  @Column(nullable = false)
  val personName: String,

  @Column(nullable = false)
  val personPhone: String
)