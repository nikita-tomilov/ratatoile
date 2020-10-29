package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.Ingredient
import com.ifmo.ratatoile.dao.KitchenQueueEntry
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dao.unbox
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.dto.KitchenQueueDto
import com.ifmo.ratatoile.dto.KitchenQueueEntryDto
import com.ifmo.ratatoile.repository.KitchenQueueRepository
import org.springframework.stereotype.Service

@Service
class KitchenQueueService(
  private val guestOrderItemService: GuestOrderItemService,
  private val guestService: GuestService,
  private val kitchenQueueRepository: KitchenQueueRepository,
  private val userService: UserService,
  private val ingredientService: IngredientService
) {

  fun getQueue(): KitchenQueueDto {
    val queueEntries = kitchenQueueRepository.findAll()
        .unbox()
        .map { KitchenQueueEntryDto(it.toDto()) }
    return KitchenQueueDto(mutateIfIngredientsMissing(queueEntries)
        .filter { kitchenStatuses.contains(it.entry.status) })
  }

  //TODO: optimize maybe?
  fun getQueueForWaiter(waiterId: Long): KitchenQueueDto {
    val orderItemsForWaiter = guestOrderItemService.findAllByWaiterId(waiterId)
    val queueEntries = kitchenQueueRepository.findAllByOrderItemIn(orderItemsForWaiter)
        .unbox()
        .map { KitchenQueueEntryDto(it.toDto(), guestService.tableIdByGuestId(it.guestId)) }
    return KitchenQueueDto(mutateIfIngredientsMissing(queueEntries)
        .filter { waiterStatuses.contains(it.entry.status) })
  }

  fun mutateIfIngredientsMissing(queueEntries: List<KitchenQueueEntryDto>): List<KitchenQueueEntryDto> {
    if (queueEntries.none { it.entry.status == GuestOrderItemStatus.INGREDIENTS_MISSING }) {
      return queueEntries
    }
    val warehouse = getWarehouseStatus()
    queueEntries.forEach {
      val missing = findMissingIngredientsForDish(warehouse, it.entry.dishId)
      if (missing.isNotEmpty()) {
        it.ingredientsMissingList = missing.joinToString { it.name }
      }
    }
    return queueEntries
  }

  fun getQueueForWaiter() = getQueueForWaiter(userService.myId())

  fun sendToKitchen(guestOrderItemId: Int): KitchenQueueDto {
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, GuestOrderItemStatus.IN_QUEUE)
    val entries = kitchenQueueRepository.findAll().filter { it.orderItem.id == guestOrderItemId }
    if (entries.isEmpty()) {
      kitchenQueueRepository.save(KitchenQueueEntry(null, item))
    }
    return getQueue()
  }

  fun foodIsReady(guestOrderItemId: Int): KitchenQueueDto {
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, GuestOrderItemStatus.READY)

    val ingredients = ingredientService.getIngredients(item.dishId)
    ingredients.forEach {
      ingredientService.decreaseAmount(it.ingredient, it.amount)
    }
    updateQueueOnMissingIngredients()
    return getQueue()
  }

  fun foodIsServed(guestOrderItemId: Int): KitchenQueueDto {
    val entries = kitchenQueueRepository.findAll().filter { it.orderItem.id == guestOrderItemId }
    kitchenQueueRepository.deleteAll(entries)
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, GuestOrderItemStatus.SERVED)
    return getQueue()
  }

  fun updateFoodStatus(guestOrderItemId: Int, status: GuestOrderItemStatus): KitchenQueueDto {
    val item = guestOrderItemService.findById(guestOrderItemId)
    guestOrderItemService.updateStatus(item, status)
    return getQueue()
  }

  fun findMissingIngredientsForDish(dishId: Int): List<Ingredient> {
    return findMissingIngredientsForDish(getWarehouseStatus(), dishId)
  }

  fun findMissingIngredientsForDish(
    warehouse: Map<Ingredient, Float>,
    dishId: Int
  ): List<Ingredient> {
    val ingredientsForDish =
        ingredientService.getIngredients(dishId)
    val ingredientsAmountsThatWillBeLeft = ingredientsForDish.map {
      it.ingredient to (warehouse[it.ingredient]
        ?: error("weird fail in kitchen service")) - it.amount
    }
    return ingredientsAmountsThatWillBeLeft.filter { it.second < 0 }.map { it.first }
  }

  fun getWarehouseStatus() = ingredientService.getIngredientsAsEntities().map {
    it to it.warehouseAmount
  }.toMap()

  fun updateQueueOnMissingIngredients() {
    val warehouseStatus = getWarehouseStatus()
    kitchenQueueRepository.findAll()
        .unbox()
        .filter { statusesToCheckOnMissing.contains(it.getStatusEnum()) }
        .forEach { guestOrderItem ->
          val missingIngredients =
              findMissingIngredientsForDish(warehouseStatus, guestOrderItem.dishId)
          if (missingIngredients.isNotEmpty()) {
            updateFoodStatus(guestOrderItem.id!!, GuestOrderItemStatus.INGREDIENTS_MISSING)
          }
        }
  }

  companion object {
    private val statusesToCheckOnMissing = setOf(
        GuestOrderItemStatus.AWAITING_FOR_ACCEPTANCE,
        GuestOrderItemStatus.IN_QUEUE,
        GuestOrderItemStatus.COOKING
    )

    private val kitchenStatuses = setOf(
        GuestOrderItemStatus.INGREDIENTS_MISSING,
        GuestOrderItemStatus.IN_QUEUE,
        GuestOrderItemStatus.COOKING,
        GuestOrderItemStatus.READY)

    private val waiterStatuses = kitchenStatuses + setOf(
        GuestOrderItemStatus.AWAITING_FOR_ACCEPTANCE,
        GuestOrderItemStatus.SERVED)
  }
}