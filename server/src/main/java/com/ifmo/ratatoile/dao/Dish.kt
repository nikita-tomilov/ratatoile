package com.ifmo.ratatoile.dao

import java.math.BigDecimal
import javax.persistence.*

@Entity
@Table(name = "dish")
data class Dish(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val name: String,

  @Column(nullable = false)
  val description: String,

  @Column(nullable = false)
  val price: BigDecimal //yes in postgre it is numeric w/out float point stuff
)