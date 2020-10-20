package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.dto.KitchenQueueDto
import com.ifmo.ratatoile.dto.KitchenQueueEntryDto
import com.ifmo.ratatoile.service.KitchenQueueService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(
    value = ["/api/1.0/kitchen"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class KitchenQueueController(
  private val kitchenQueueService: KitchenQueueService
) {

  //TODO: only kitchen user should be able to call everything here (except for waiter endpoint)
  @GetMapping("/queue/kitchen")
  fun getQueue(): KitchenQueueDto = kitchenQueueService.getQueue()

  @GetMapping("/queue/waiter")
  fun getQueuePerWaiter(): KitchenQueueDto = kitchenQueueService.getQueueForWaiter()

  @GetMapping("/send/to/kitchen/{order_item_id}")
  fun sendToKitchen(
    @PathVariable("order_item_id") orderItemId: Int
  ) = kitchenQueueService.sendToKitchen(orderItemId)

  @GetMapping("/set/queued/{order_item_id}")
  fun setAsQueued(
    @PathVariable("order_item_id") orderItemId: Int
  ) = kitchenQueueService.updateFoodStatus(orderItemId, GuestOrderItemStatus.IN_QUEUE)

  @GetMapping("/set/cooking/{order_item_id}")
  fun setAsCooking(
    @PathVariable("order_item_id") orderItemId: Int
  ) = kitchenQueueService.updateFoodStatus(orderItemId, GuestOrderItemStatus.COOKING)

  @GetMapping("/set/ready/{order_item_id}")
  fun setAsReady(
    @PathVariable("order_item_id") orderItemId: Int
  ) = kitchenQueueService.updateFoodStatus(orderItemId, GuestOrderItemStatus.READY)

  @GetMapping("/set/served/{order_item_id}")
  fun setAsServed(
    @PathVariable("order_item_id") orderItemId: Int
  ) = kitchenQueueService.foodIsServed(orderItemId)
}