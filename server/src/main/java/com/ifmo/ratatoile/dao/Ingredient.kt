package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "ingredient")
data class Ingredient(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val name: String,

  @Column(nullable = false)
  var warehouseAmount: Float,

  @Column(nullable = false)
  val uom: String
)