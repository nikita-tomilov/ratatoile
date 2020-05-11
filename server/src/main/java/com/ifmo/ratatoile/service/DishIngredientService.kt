package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Dish
import com.ifmo.ratatoile.dao.DishIngredient
import com.ifmo.ratatoile.dto.DishIngredientDto
import com.ifmo.ratatoile.dto.DishWithIngredientsDto
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.repository.DishIngredientRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class DishIngredientService(
  private val ingredientService: IngredientService,
  private val dishService: DishService,
  private val dishIngredientRepository: DishIngredientRepository,
  private val dishPhotoService: DishPhotoService
) {

  fun findIngredientsForDish(dishId: Int): List<DishIngredientDto> {
    return dishIngredientRepository.findByDishId(dishId).map {
      val ingredient = ingredientService.getIngredientAsEntity(it.ingredientId)
      DishIngredientDto(it.id!!, ingredient.id!!, ingredient.name, it.amount.toDouble())
    }
  }

  fun getDishWithIngredients(dishId: Int): DishWithIngredientsDto {
    val dish = dishService.getDishAsEntity(dishId)
    return getDishWithIngredients(dish)
  }

  fun getDishWithIngredients(d: Dish): DishWithIngredientsDto {
    val ingredients = findIngredientsForDish(d.id!!)
    return DishWithIngredientsDto(
        d.id!!,
        d.name,
        d.description,
        d.price.toDouble(),
        dishPhotoService.getImageId(d.id!!),
        ingredients)
  }

  fun addIngredientToDish(dishId: Int, ingredientId: Int, amount: Double): DishWithIngredientsDto {
    val dish = dishService.getDishAsEntity(dishId)
    val ingredient = ingredientService.getIngredientAsEntity(ingredientId)
    val new = DishIngredient(null, dish.id!!, ingredient.id!!, amount.toFloat())
    dishIngredientRepository.saveAndFlush(new)
    return getDishWithIngredients(dish)
  }

  fun deleteIngredientFromDish(id: Int): DishWithIngredientsDto {
    val entry = dishIngredientRepository.findByIdOrNull(id)
      ?: throw BadRequestException("dish ingredient entry for id $id not found")
    dishIngredientRepository.deleteById(id)
    val dish = dishService.getDishAsEntity(entry.dishId)
    return getDishWithIngredients(dish)
  }
}