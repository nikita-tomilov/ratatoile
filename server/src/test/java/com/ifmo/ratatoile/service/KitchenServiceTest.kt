package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.controller.KitchenQueueController
import com.ifmo.ratatoile.dao.*
import com.ifmo.ratatoile.dto.DishCreateRequestDto
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.dto.IngredientCreateRequestDto
import com.ifmo.ratatoile.repository.*
import org.assertj.core.api.AssertionsForInterfaceTypes.assertThat
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.test.context.TestPropertySource
import java.time.Instant

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class KitchenServiceTest {

  @Autowired
  lateinit var userRepository: UserRepository

  @Autowired
  lateinit var tableRepository: EatingTableRepository

  @Autowired
  lateinit var guestRepository: GuestRepository

  @Autowired
  lateinit var guestOrderItemRepository: GuestOrderItemRepository

  @Autowired
  lateinit var kitchenQueueRepository: KitchenQueueRepository

  @Autowired
  lateinit var dishService: DishService

  @Autowired
  lateinit var dishIngredientService: DishIngredientService

  @Autowired
  lateinit var ingredientService: IngredientService

  @Autowired
  lateinit var guestOrderItemService: GuestOrderItemService

  @Autowired
  lateinit var kitchenQueueService: KitchenQueueService

  @Autowired
  lateinit var kitchenQueueController: KitchenQueueController

  private lateinit var dishes: List<Dish>

  private var ingredientId = 1

  private var guestId = 1

  private lateinit var table: EatingTable

  private lateinit var waiter: User

  private lateinit var guest: Guest

  @BeforeAll
  fun setupDishes() {
    dishes = prepareDishes()
  }

  @BeforeEach
  fun cleanup() {
    kitchenQueueRepository.deleteAll()
    guestOrderItemRepository.deleteAll()
    guestRepository.deleteAll()

    table = tableRepository.findByIdOrNull(1) ?: error("migration for tables is broken")
    waiter = userRepository.findByIdOrNull(2L) ?: error("migration for users is broken")
    guest = Guest(null, Instant.now(), null, table, waiter)
    guestRepository.saveAndFlush(guest)
    guestId = guestRepository.findAll().first().id ?: error("guest repo is broken")
    ingredientService.setAmount(ingredientId, 1000.0f)
  }

  @Test
  fun `can add dish to guest`() {
    //when
    buildAndSaveDummyGuestOrderItems()
    //then
    assertThat(guestOrderItemService.findAllByGuestId(guestId)).hasSize(5)
  }

  @Test
  fun `can send order items to kitchen`() {
    //given
    val orderItems = buildAndSaveDummyGuestOrderItems()
    orderItems.forEach { assertThat(it.status).isEqualTo(GuestOrderItemStatus.AWAITING_FOR_ACCEPTANCE.name) }
    assertThat(kitchenQueueService.getQueue().items).isEmpty()
    //when
    orderItems.forEach { kitchenQueueService.sendToKitchen(it.id ?: error("should-never-happen")) }
    //then
    val queue = kitchenQueueService.getQueue().items
    assertThat(queue).hasSize(5)
    queue.forEach { assertThat(it.entry.status).isEqualTo(GuestOrderItemStatus.IN_QUEUE) }
  }

  @Test
  fun `kitchen can change food status`() {
    //given
    `can send order items to kitchen`()
    val queue = kitchenQueueService.getQueue().items
    val dish = queue[2]
    val orderItemId = dish.entry.id
    //when
    kitchenQueueController.setAsCooking(orderItemId)
    //then
    assertThat(guestOrderItemService.findById(orderItemId).status).isEqualTo(GuestOrderItemStatus.COOKING.name)
    //when
    kitchenQueueController.setAsReady(orderItemId)
    //then
    assertThat(guestOrderItemService.findById(orderItemId).status).isEqualTo(GuestOrderItemStatus.READY.name)
  }

  @Test
  fun `marking food as served removes it from kitchen queue`() {
    //given
    `can send order items to kitchen`()
    val queue = kitchenQueueService.getQueue().items
    val dish = queue[2]
    val orderItemId = dish.entry.id
    //when
    kitchenQueueController.setAsServed(orderItemId)
    //then
    assertThat(guestOrderItemService.findById(orderItemId).status).isEqualTo(GuestOrderItemStatus.SERVED.name)
    assertThat(kitchenQueueService.getQueue().items).hasSize(4)
  }

  @Test
  fun `per-waiter queue works`() {
    //given
    `can send order items to kitchen`()
    //when
    val queuePerWaiter = kitchenQueueService.getQueueForWaiter(waiter.id!!)
    //then
    assertThat(queuePerWaiter.items).hasSize(5)
    //when
    val queuePerAnotherWaiter = kitchenQueueService.getQueueForWaiter(999999L)
    //then
    assertThat(queuePerAnotherWaiter.items).isEmpty()
  }

  @Test
  fun `marking food as ready works and reduces ingredient amount`() {
    //given
    `can send order items to kitchen`()
    val ingredientAmountBefore =
        ingredientService.getIngredientAsEntity(ingredientId).warehouseAmount
    val queue = kitchenQueueService.getQueue().items
    val dish = queue[2]
    val orderItemId = dish.entry.id
    //when
    kitchenQueueController.setAsReady(orderItemId)
    //then
    assertThat(guestOrderItemService.findById(orderItemId).status).isEqualTo(GuestOrderItemStatus.READY.name)
    //when
    val ingredientAmountAfter =
        ingredientService.getIngredientAsEntity(ingredientId).warehouseAmount
    //then
    assertThat(ingredientAmountAfter).isEqualTo(ingredientAmountBefore - 0.1f)
  }

  @Test
  fun `marking food as ready triggers ingredients missing check`() {
    //given
    `can send order items to kitchen`()
    ingredientService.setAmount(ingredientId, 0.15f)
    val queue = kitchenQueueService.getQueue().items
    val dish = queue[2]
    val orderItemId = dish.entry.id
    //when
    kitchenQueueController.setAsReady(orderItemId)
    //then
    assertThat(guestOrderItemService.findById(orderItemId).status).isEqualTo(GuestOrderItemStatus.READY.name)
    val updatedQueue = kitchenQueueService.getQueue()
    updatedQueue.items.forEach {
      if (it.entry.id != orderItemId) {
        assertThat(guestOrderItemService.findById(it.entry.id).status).isEqualTo(
            GuestOrderItemStatus.INGREDIENTS_MISSING.name)
        assertThat(it.ingredientsMissingList.contains("whatever-ingredient"))
      }
    }
  }

  private fun buildAndSaveDummyGuestOrderItems(): List<GuestOrderItem> {
    return dishes.map {
      val id = it.id ?: error("should-never-happen")
      val orderItemId = guestOrderItemService.addDishToGuest(guestId, id).orderItems.last().id
      guestOrderItemService.findById(orderItemId)
    }
  }

  private fun prepareDishes(): List<Dish> {
    val ingredient = ingredientService.getIngredientAsEntity(
        ingredientService.addIngredient(
            IngredientCreateRequestDto(
                "whatever-ingredient",
                1000.0,
                "kg"
            )).id)
    ingredientId = ingredient.id ?: error("ingredient add is broken")
    val dishes = (0 until 5).map {
      dishService.getDishAsEntity(
          dishService.addDish(
              DishCreateRequestDto(
                  "whatever-dish-$it",
                  "whatever",
                  100.0,
                  null
              )).id)
    }
    dishes.forEach {
      dishIngredientService.addIngredientToDish(
          it.id ?: error("should-never-happen"),
          ingredient.id ?: error("should-never-happen"),
          0.1)
    }
    return dishes
  }
}