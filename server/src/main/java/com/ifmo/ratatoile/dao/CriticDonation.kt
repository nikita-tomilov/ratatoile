package com.ifmo.ratatoile.dao

import java.time.Instant
import javax.persistence.*

@Entity
@Table(name = "critic_donations")
data class CriticDonation(

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "ID")
  val id: Int? = null,

  @Column(nullable = false)
  val amount: Int,

  @Column(nullable = false)
  val criticName: String,

  @Column(nullable = false)
  val reason: String,

  @Column(nullable = false)
  val date: Instant
)