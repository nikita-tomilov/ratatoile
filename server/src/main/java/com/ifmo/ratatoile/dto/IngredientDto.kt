package com.ifmo.ratatoile.dto

data class IngredientDto(
  val id: Int,
  val name: String,
  val warehouseAmount: Double,
  val uom: String
)

data class IngredientCreateRequestDto(val name: String, val uom: String)

data class IngredientsDto(
  val ingredients: List<IngredientDto>
)