package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dto.IngredientCreateRequestDto
import com.ifmo.ratatoile.dto.IngredientDto
import com.ifmo.ratatoile.service.IngredientService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(value = ["/api/1.0/ingredient/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class IngredientController(
  private val ingredientService: IngredientService
) {

  @GetMapping("/all")
  fun allIngredients() = ingredientService.getIngredients()

  @GetMapping("/get/{id}")
  fun getIngredient(@PathVariable("id") id: Int) = ingredientService.getIngredient(id)

  //2st step of creating menu item - Create ingredients
  @PostMapping("/create")
  fun createIngredient(@RequestBody rq: IngredientCreateRequestDto) =
      ingredientService.addIngredient(rq)

  @PostMapping("/update")
  fun updateIngredient(@RequestBody rq: IngredientDto) = ingredientService.changeIngredient(rq)

  @GetMapping("/delete/{id}")
  fun deleteIngredient(@PathVariable("id") id: Int) = ingredientService.deleteIngredient(id)
}