package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.service.GuestOrderItemService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(
    value = ["/api/1.0/guest/order/entry/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class GuestOrderItemController(
  private val guestOrderItemService: GuestOrderItemService
) {

  @GetMapping("/add/{guest_id}/{dish_id}")
  fun addDishToGuest(
    @PathVariable("guest_id") guestId: Int,
    @PathVariable("dish_id") dishId: Int
  ) = guestOrderItemService.addDishToGuest(guestId, dishId)

  @GetMapping("/{order_item_id}/remove")
  fun rmDishFromGuest(
    @PathVariable("order_item_id") orderItemId: Int
  ) = guestOrderItemService.rmDishFromGuest(orderItemId)

}