package com.ifmo.ratatoile.dto

data class MenuEntryDto(
  val id: Int,
  val addedAt: Long,
  val menuPosition: Int,
  val dish: DishWithIngredientsDto
)

data class MenuDto(
  val menu: List<MenuEntryDto>
)