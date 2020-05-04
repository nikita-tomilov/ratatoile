package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "dish_photo")
data class DishPhoto(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val path: String
)