package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "dish_ingredient")
data class DishIngredient(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val dishId: Int,

  @Column(nullable = false)
  val ingredientId: Int,

  @Column(nullable = false)
  val amount: Float
)