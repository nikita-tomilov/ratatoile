package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.*
import com.ifmo.ratatoile.dto.DishCreateRequestDto
import com.ifmo.ratatoile.dto.GuestCardRequestDto
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
import java.math.BigDecimal
import java.time.Instant

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class GuestServiceTest {

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
  lateinit var guestService: GuestService

  @Autowired
  lateinit var guestOrderItemService: GuestOrderItemService

  @Autowired
  lateinit var kitchenQueueService: KitchenQueueService

  @Autowired
  lateinit var paidOrderItemRepository: PaidOrderItemRepository

  @Autowired
  lateinit var guestCardService: GuestCardService

  @Autowired
  lateinit var guestCardRepository: GuestCardRepository

  private lateinit var dishes: List<Dish>

  private var ingredientId = 1

  private var guestId = 1

  private lateinit var table: EatingTable

  private lateinit var waiter: User

  private lateinit var guest: Guest

  private lateinit var guestCard: GuestCard

  @BeforeAll
  fun setupDishes() {
    dishes = prepareDishes()
  }

  @BeforeEach
  fun cleanup() {
    kitchenQueueRepository.deleteAll()
    guestOrderItemRepository.deleteAll()
    guestRepository.deleteAll()
    paidOrderItemRepository.deleteAll()
    guestCardRepository.deleteAll()

    table = tableRepository.findByIdOrNull(1) ?: error("migration for tables is broken")
    waiter = userRepository.findByIdOrNull(2L) ?: error("migration for users is broken")
    guest = Guest(null, Instant.now(), null, table, waiter)
    guestRepository.saveAndFlush(guest)
    guestId = guestRepository.findAll().first().id ?: error("guest repo is broken")
    ingredientService.setAmount(ingredientId, 1000.0f)

    guestCardService.createGuestCard(GuestCardRequestDto("", "", 0, 5))
    guestCard = guestCardRepository.findAll().first()
  }

  fun prepareDummyFood(): Int {
    val orderItems = buildAndSaveDummyGuestOrderItems()
    orderItems.forEach {
      kitchenQueueService.sendToKitchen(it.id ?: error("should-never-happen"))
    }
    val queue = kitchenQueueService.getQueue().items
    queue.forEach { kitchenQueueService.foodIsReady(it.entry.id) }
    queue.filter { it.entry.id % 2 == 0 }
        .forEach { kitchenQueueService.foodIsServed(it.entry.id) }
    return queue.count { it.entry.id % 2 == 0 }
  }

  @Test
  fun `checkout gives correct statuses to order entries`() {
    //given
    prepareDummyFood()
    //when
    guestService.checkoutTable(table.id ?: error("should-never-happen"))
    //then
    val orderItems = guestOrderItemRepository.findAll()
    orderItems.filter { it.id!! % 2 == 0 }
        .forEach { assertThat(it.getStatusEnum() == GuestOrderItemStatus.getFinalStatus()) }
    orderItems.filter { it.id!! % 2 != 0 }
        .forEach { assertThat(it.getStatusEnum() == GuestOrderItemStatus.CANCELLED) }
  }

  @Test
  fun `checkout produces valid receipt`() {
    //given
    val servedCount = prepareDummyFood()
    //when
    val receipt = guestService.checkoutTable(table.id ?: error("should-never-happen"))
    //then
    val positions = receipt.guests[0].positions
    val calculatedSum = positions.map { it.price }.sum()
    assertThat(calculatedSum).isEqualTo(servedCount * 100.0)
    assertThat(positions).hasSize(servedCount)
    assertThat(receipt.guests[0].sumPerGuest).isEqualTo(calculatedSum)
    assertThat(receipt.totalSum).isEqualTo(calculatedSum)
  }

  @Test
  fun `checkout with guest card produces valid receipt`() {
    //given
    val servedCount = prepareDummyFood()
    //when
    val receipt = guestService.checkoutTable(table.id ?: error("should-never-happen"), guestCard.id)
    //then
    val positions = receipt.guests[0].positions
    val calculatedSum = positions.map { it.price }.sum()
    assertThat(calculatedSum).isEqualTo(servedCount * 100.0)
    assertThat(positions).hasSize(servedCount )
    assertThat(receipt.guests[0].sumPerGuest).isEqualTo(calculatedSum * 0.95)
    assertThat(receipt.totalSum).isEqualTo(calculatedSum * 0.95)
  }

  @Test
  fun `checkout registers paid entries to separate table`() {
    //given
    val servedCount = prepareDummyFood()
    //when
    guestService.checkoutTable(table.id ?: error("should-never-happen"))
    //then
    val paidOrderItems = paidOrderItemRepository.findAll()
    assertThat(paidOrderItems).hasSize(servedCount)
    paidOrderItems.forEach { assertThat(it.originalPrice == it.paidPrice) }
  }

  @Test
  fun `checkout with guest card applies discount`() {
    //given
    val servedCount = prepareDummyFood()
    //when
    guestService.checkoutTable(table.id ?: error("should-never-happen"), guestCard.id)
    //then
    val paidOrderItems = paidOrderItemRepository.findAll()
    assertThat(paidOrderItems).hasSize(servedCount)
    paidOrderItems.forEach {
      assertThat(
          it.originalPrice == it.paidPrice.multiply(
              BigDecimal.valueOf(
                  0.95)))
    }
  }

  @Test
  fun `status produces valid intermediate receipt`() {
    //given
    val requestedCount = 5
    prepareDummyFood()
    //when
    val receipt = guestService.tableStatus(table.id ?: error("should-never-happen"))
    //then
    val positions = receipt.guests[0].positions
    val calculatedSum = positions.map { it.price }.sum()
    assertThat(calculatedSum).isEqualTo(requestedCount * 100.0)
    assertThat(positions).hasSize(requestedCount)
    assertThat(receipt.guests[0].sumPerGuest).isEqualTo(calculatedSum)
    assertThat(receipt.totalSum).isEqualTo(calculatedSum)
  }

  @Test
  fun `status with guest card produces valid intermediate receipt`() {
    //given
    val requestedCount = 5
    prepareDummyFood()
    //when
    val receipt = guestService.tableStatus(table.id ?: error("should-never-happen"), guestCard.id)
    //then
    val positions = receipt.guests[0].positions
    val calculatedSum = positions.map { it.price }.sum()
    assertThat(calculatedSum).isEqualTo(requestedCount * 100.0)
    assertThat(positions).hasSize(requestedCount )
    assertThat(receipt.guests[0].sumPerGuest).isEqualTo(calculatedSum * 0.95)
    assertThat(receipt.totalSum).isEqualTo(calculatedSum * 0.95)
  }

  @Test
  fun `precheckout produces valid receipt`() {
    //given
    val servedCount = prepareDummyFood()
    //when
    val receipt = guestService.tablePrecheckout(table.id ?: error("should-never-happen"))
    //then
    val positions = receipt.guests[0].positions
    val calculatedSum = positions.map { it.price }.sum()
    assertThat(calculatedSum).isEqualTo(servedCount * 100.0)
    assertThat(positions).hasSize(servedCount)
    assertThat(receipt.guests[0].sumPerGuest).isEqualTo(calculatedSum)
    assertThat(receipt.totalSum).isEqualTo(calculatedSum)
  }

  @Test
  fun `precheckout with guest card produces valid receipt`() {
    //given
    val servedCount = prepareDummyFood()
    //when
    val receipt = guestService.tablePrecheckout(table.id ?: error("should-never-happen"), guestCard.id)
    //then
    val positions = receipt.guests[0].positions
    val calculatedSum = positions.map { it.price }.sum()
    assertThat(calculatedSum).isEqualTo(servedCount * 100.0)
    assertThat(positions).hasSize(servedCount )
    assertThat(receipt.guests[0].sumPerGuest).isEqualTo(calculatedSum * 0.95)
    assertThat(receipt.totalSum).isEqualTo(calculatedSum * 0.95)
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