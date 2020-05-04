package com.ifmo.ratatoile.dto

data class DishWithIngredientsDto(
  val id: Int,
  val name: String,
  val description: String,
  val price: Double,
  val photoId: Int?,
  val ingredients: List<DishIngredientDto>
)

data class DishIngredientDto(
  val entryId: Int,
  val ingredientId: Int,
  val name: String,
  val amount: Double
)