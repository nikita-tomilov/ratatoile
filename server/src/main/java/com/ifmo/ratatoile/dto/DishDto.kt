package com.ifmo.ratatoile.dto

data class DishDto(
  val id: Int,
  val name: String,
  val description: String,
  val price: Double,
  val photoId: Int?
)

data class DishesDto(
  val dishes: List<DishDto>
)

data class DishCreateRequestDto(
  val name: String,
  val description: String,
  val price: Double,
  val photoId: Int?
)