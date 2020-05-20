package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.DishPhotoService
import com.ifmo.ratatoile.service.MenuService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/menu/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class MenuController(
  private val dishPhotoService: DishPhotoService,
  private val menuService: MenuService
) {

  @GetMapping(
      value = ["/dishphoto/{id}"],
      produces = [MediaType.IMAGE_JPEG_VALUE]
  )
  fun getDishPhoto(@PathVariable("id") id: Int): ByteArray = dishPhotoService.getImage(id)

  @GetMapping("/get")
  fun menu() = menuService.getCurrentMenu()

  //4th step of creating menu item - Add dish to menu
  @GetMapping("/add/{dishid}/{position}")
  fun addEntry(
    @PathVariable("dishid") dishId: Int,
    @PathVariable("position") position: Int
  ) = menuService.addEntryToMenu(dishId, position)

  @DeleteMapping("/delete/{id}")
  fun deleteEntry(@PathVariable("id") id: Int) = menuService.deleteEntryFromMenu(id)

}