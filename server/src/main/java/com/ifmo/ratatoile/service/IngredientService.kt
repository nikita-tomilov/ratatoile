package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Ingredient
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.IngredientCreateRequestDto
import com.ifmo.ratatoile.dto.IngredientDto
import com.ifmo.ratatoile.dto.IngredientsDto
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.IngredientRepository
import mu.KLogging
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class IngredientService(
  private val ingredientRepository: IngredientRepository
) {

  fun getIngredients(): IngredientsDto =
      IngredientsDto(ingredientRepository.findAll().map { it.toDto() })

  fun getIngredient(id: Int): IngredientDto {
    val i = getIngredientAsEntity(id)
    return i.toDto()
  }

  fun getIngredientAsEntity(id: Int): Ingredient {
    return ingredientRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no ingredient for idd $id")
  }

  fun addIngredient(rq: IngredientCreateRequestDto): IngredientDto {
    val new = Ingredient(null, rq.name, 0.0f, rq.uom)
    val saved = ingredientRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun changeIngredient(rq: IngredientDto): IngredientDto {
    val new = Ingredient(rq.id, rq.name, rq.warehouseAmount.toFloat(), rq.uom)
    val saved = ingredientRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun setAmount(id: Int, amount: Double): IngredientDto {
    val existing = getIngredientAsEntity(id)
    existing.warehouseAmount = amount.toFloat()
    ingredientRepository.save(existing)
    return existing.toDto()
  }

  fun decreaseAmount(id: Int, amount: Double): IngredientDto {
    val existing = getIngredientAsEntity(id)
    return setAmount(id, existing.warehouseAmount - amount)
  }

  fun deleteIngredient(id: Int): IngredientDto {
    val i = getIngredientAsEntity(id)
    ingredientRepository.deleteById(id)
    return i.toDto()
  }

  companion object : KLogging()
}