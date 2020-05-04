package com.ifmo.ratatoile.dto

data class DishIngredientDto(
  val entryId: Int,
  val ingredientId: Int,
  val name: String,
  val amount: Double
)