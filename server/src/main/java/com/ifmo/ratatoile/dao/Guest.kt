package com.ifmo.ratatoile.dao

import java.time.Instant
import javax.persistence.*

@Entity
@Table(name = "guest")
data class Guest(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,


  @Column(nullable = false)
  val enteredAt: Instant,

  @Column
  var leavedAt: Instant? = null,

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "table_id", nullable = false)
  val table: EatingTable,

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "waiter_id", nullable = false)
  val waiter: User
)