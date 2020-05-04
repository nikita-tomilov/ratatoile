package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Dish
import com.ifmo.ratatoile.dto.DishIngredientDto
import com.ifmo.ratatoile.dto.MenuDishDto
import com.ifmo.ratatoile.dto.MenuDishesDto
import com.ifmo.ratatoile.repository.DishIngredientRepository
import com.ifmo.ratatoile.repository.DishRepository
import com.ifmo.ratatoile.repository.IngredientRepository
import com.ifmo.ratatoile.repository.MenuEntryRepository
import javassist.NotFoundException
import mu.KLogging
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MenuService(
  private val dishRepository: DishRepository,
  private val dishIngredientRepository: DishIngredientRepository,
  private val ingredientRepository: IngredientRepository,
  private val menuEntryRepository: MenuEntryRepository
) {

  fun getCurrentMenu(): MenuDishesDto {
    val dishes = menuEntryRepository.findAll()
        .sortedBy { it.menuPosition }
        .map { it.dishId }.mapNotNull {
          val dish = dishRepository.findByIdOrNull(it)
          if (dish == null) logger.error { "No dish for id $it found" }
          dish
        }
        .map { dishToMenuDishDto(it) }
    return MenuDishesDto(dishes)
  }

  private fun dishToMenuDishDto(d: Dish): MenuDishDto {
    val ingredients = dishIngredientRepository.findByDishId(d.id!!).map {
      val ingredient = ingredientRepository.findByIdOrNull(it.ingredientId)
        ?: throw NotFoundException("for dish ${d.name} cannot find ingredient ${it.ingredientId}")
      DishIngredientDto(it.id!!, ingredient.id!!, ingredient.name, it.amount.toDouble())
    }
    return MenuDishDto(d.id!!, d.name, d.description, d.price.toDouble(), d.photo?.id, ingredients)
  }

  companion object : KLogging()
}