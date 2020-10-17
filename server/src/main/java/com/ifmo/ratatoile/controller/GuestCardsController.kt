package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.GuestCardDtos
import com.ifmo.ratatoile.dto.GuestCardRequestDto
import com.ifmo.ratatoile.service.GuestCardService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(value = ["/api/1.0/cards/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class GuestCardsController(
  private val guestCardService: GuestCardService
) {

  @GetMapping("/all")
  fun allGuestCards() = GuestCardDtos(guestCardService.getAllGuestCards().map { it.toDto() })

  @GetMapping("/get/{id}")
  fun getGuestCard(@PathVariable("id") id: Int) = guestCardService.getGuestCard(id).toDto()

  @PostMapping("/create")
  fun createGuestCard(@RequestBody rq: GuestCardRequestDto) =
      guestCardService.createGuestCard(rq).toDto()

  @DeleteMapping("/delete/{id}")
  fun deleteGuestCard(@PathVariable("id") id: Int) = guestCardService.deleteGuestCard(id).toDto()

}