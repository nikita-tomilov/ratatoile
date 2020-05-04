package com.ifmo.ratatoile.dto

data class IngredientDto(
  val id: Int,
  val name: String
)

data class IngredientCreateRequestDto(val name: String)

data class IngredientsDto(
  val ingredients: List<IngredientDto>
)