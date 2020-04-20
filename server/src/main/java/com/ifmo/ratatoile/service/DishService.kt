package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.DishesDto
import com.ifmo.ratatoile.repository.DishRepository
import org.springframework.stereotype.Service

@Service
class DishService(
  private val dishRepository: DishRepository
) {

  fun getEntityById(id: Int) = dishRepository.findById(id).get()

  fun getAll() = DishesDto(dishRepository.findAll().map { it.toDto() })
}