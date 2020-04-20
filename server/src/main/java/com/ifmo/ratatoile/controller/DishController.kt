package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.DishService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/api/1.0/dish/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class DishController(
  private val dishService: DishService
) {

  @GetMapping("/all")
  fun menu() = dishService.getAll()
}