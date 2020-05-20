package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Dish
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.DishCreateRequestDto
import com.ifmo.ratatoile.dto.DishDto
import com.ifmo.ratatoile.dto.DishesDto
import com.ifmo.ratatoile.exception.BadRequestException
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.DishRepository
import com.ifmo.ratatoile.repository.MenuEntryRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.math.BigDecimal

@Service
class DishService(
  private val dishRepository: DishRepository,
  private val menuEntryRepository: MenuEntryRepository
) {

  fun getDishAsEntity(id: Int): Dish {
    return dishRepository.findByIdOrNull(id) ?: throw NotFoundException("no dish for id $id")
  }

  fun getDishes() = DishesDto(dishRepository.findAll().map { it.toDto() })

  fun getDish(id: Int): DishDto {
    val i = getDishAsEntity(id)
    return i.toDto()
  }

  fun addDish(rq: DishCreateRequestDto): DishDto {
    val new = Dish(null, rq.name, rq.description, BigDecimal(rq.price))
    val saved = dishRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun changeDish(rq: DishDto): DishDto {
    val new = Dish(rq.id, rq.name, rq.description, BigDecimal(rq.price))
    val saved = dishRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun deleteDish(id: Int): DishDto {
    val i = getDishAsEntity(id)
    if (isDishUsedInMenu(id)) {
      throw BadRequestException("Dish id=$id is used in menu")
    }
    dishRepository.deleteById(id)
    return i.toDto()
  }

  private fun isDishUsedInMenu(dishId: Int): Boolean {
    val dishIDs = menuEntryRepository.findAll().map { it.dishId }
    return dishIDs.contains(dishId)
  }

}