package com.ifmo.ratatoile.dto

data class MenuDishDto(
  val id: Int,
  val name: String,
  val description: String,
  val price: Double,
    val photoId: Int?,
    val ingredients: List<DishIngredientDto>
)