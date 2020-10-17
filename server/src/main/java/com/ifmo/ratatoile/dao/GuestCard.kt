package com.ifmo.ratatoile.dao

import java.time.Instant
import javax.persistence.*

@Entity
@Table(name = "guest_card")
data class GuestCard(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  var fullName: String,

  @Column(nullable = false)
  var phone: String,

  @Column(nullable = false)
  val birthday: Instant
)