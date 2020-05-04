package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.DishIngredientService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/api/1.0/dishingredient/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class DishIngredientController(
  private val dishIngredientService: DishIngredientService
) {

  //3st step of creating menu item - Assign ingredients to created dish
  @GetMapping("/add/{dishid}/{ingredientid}/{amount}")
  fun addIngredientToDish(
    @PathVariable("dishid") dishid: Int,
    @PathVariable("ingredientid") ingredientid: Int,
    @PathVariable("amount") amount: Double
  ) = dishIngredientService.addIngredientToDish(dishid, ingredientid, amount)

  @GetMapping("/delete/{entryid}")
  fun deleteIngredientFromDish(
    @PathVariable("entryid") entryid: Int
  ) = dishIngredientService.deleteIngredientFromDish(entryid)

  @GetMapping("/getdish/{dishid}")
  fun getDishWithIngredients(
    @PathVariable("dishid") dishid: Int
  ) = dishIngredientService.getDishWithIngredients(dishid)

}