package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.DishPhotoService
import com.ifmo.ratatoile.service.MenuService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
  fun createReservation(@PathVariable("id") id: Int): ByteArray = dishPhotoService.getImage(id)

  @GetMapping("/get")
  fun menu() = menuService.getCurrentMenu()
}