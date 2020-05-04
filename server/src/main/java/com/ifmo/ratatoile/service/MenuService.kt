package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.MenuEntry
import com.ifmo.ratatoile.dto.MenuDto
import com.ifmo.ratatoile.dto.MenuEntryDto
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.MenuEntryRepository
import mu.KLogging
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class MenuService(
  private val dishService: DishService,
  private val dishIngredientService: DishIngredientService,
  private val menuEntryRepository: MenuEntryRepository
) {

  fun getCurrentMenu(): MenuDto {
    val dishes = menuEntryRepository.findAll()
        .sortedBy { it.menuPosition }
        .map {
          it to dishService.getDishAsEntity(it.dishId)
        }
        .map {
          MenuEntryDto(
              it.first.id!!,
              it.first.addedAt,
              it.first.menuPosition,
              dishIngredientService.getDishWithIngredients(it.second))
        }
    return MenuDto(dishes)
  }

  fun addEntryToMenu(dishId: Int, position: Int): MenuEntryDto {
    val dish = dishService.getDishAsEntity(dishId)
    val newEntry = MenuEntry(null, dishId, Instant.now().toEpochMilli(), position)
    val saved = menuEntryRepository.saveAndFlush(newEntry)
    return MenuEntryDto(
        saved.id!!,
        saved.addedAt,
        saved.menuPosition,
        dishIngredientService.getDishWithIngredients(dish))
  }

  fun deleteEntryFromMenu(id: Int): MenuEntryDto {
    val entry = menuEntryRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no menu entry for id $id")
    menuEntryRepository.deleteById(id)
    val dish = dishService.getDishAsEntity(entry.dishId)
    return MenuEntryDto(
        entry.id!!,
        entry.addedAt,
        entry.menuPosition,
        dishIngredientService.getDishWithIngredients(dish))
  }

  companion object : KLogging()
}