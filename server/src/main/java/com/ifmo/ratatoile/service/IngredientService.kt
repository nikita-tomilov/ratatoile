package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Ingredient
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.IngredientCreateRequestDto
import com.ifmo.ratatoile.dto.IngredientDto
import com.ifmo.ratatoile.dto.IngredientsDto
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.IngredientRepository
import mu.KLogging
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class IngredientService(
  private val ingredientRepository: IngredientRepository,
  private val dishIngredientService: DishIngredientService
) {

  fun getIngredients(): IngredientsDto =
      IngredientsDto(ingredientRepository.findAll().map { it.toDto() })

  fun getIngredient(id: Int): IngredientDto {
    val i = getIngredientAsEntity(id)
    return i.toDto()
  }

  fun getIngredients(dishId: Int) = dishIngredientService.findDishIngredients(dishId)

  fun getIngredientAsEntity(id: Int): Ingredient {
    return ingredientRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no ingredient for idd $id")
  }

  fun getIngredientsAsEntities(): List<Ingredient> = ingredientRepository.findAll()

  fun addIngredient(rq: IngredientCreateRequestDto): IngredientDto {
    val new = Ingredient(null, rq.name, rq.warehouseAmount.toFloat(), rq.uom)
    val saved = ingredientRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun changeIngredient(rq: IngredientDto): IngredientDto {
    val new = Ingredient(rq.id, rq.name, rq.warehouseAmount.toFloat(), rq.uom)
    val saved = ingredientRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun setAmount(ingredient: Ingredient, amount: Float): IngredientDto {
    ingredient.warehouseAmount = amount
    ingredientRepository.save(ingredient)
    return ingredient.toDto()
  }

  fun setAmount(id: Int, amount: Float): IngredientDto {
    val existing = getIngredientAsEntity(id)
    return setAmount(existing, amount)
  }

  fun decreaseAmount(ingredient: Ingredient, amount: Float): IngredientDto {
    return setAmount(ingredient, ingredient.warehouseAmount - amount)
  }

  fun deleteIngredient(id: Int): IngredientDto {
    val i = getIngredientAsEntity(id)
    val dishes = dishIngredientService.getDishesForIngredient(i.id!!)
    if (dishes.isNotEmpty()) {
      throw BadRequestException("This dish is used in ${dishes.joinToString { it.name }}")
    }
    ingredientRepository.deleteById(id)
    return i.toDto()
  }

  companion object : KLogging()
}