package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dto.DishCreateRequestDto
import com.ifmo.ratatoile.dto.DishDto
import com.ifmo.ratatoile.service.DishService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(value = ["/api/1.0/dish/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class DishController(
  private val dishService: DishService
) {

  @GetMapping("/all")
  fun allDishes() = dishService.getDishes()

  @GetMapping("/get/{id}")
  fun getDish(@PathVariable("id") id: Int) = dishService.getDish(id)

  //1st step of creating menu item - Create dish
  @PostMapping("/create")
  fun createDish(@RequestBody rq: DishCreateRequestDto) = dishService.addDish(rq)

  @PostMapping("/update")
  fun updateDish(@RequestBody rq: DishDto) = dishService.changeDish(rq)

  @GetMapping("/delete/{id}")
  fun deleteDish(@PathVariable("id") id: Int) = dishService.deleteDish(id)
}