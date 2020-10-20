package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.*
import com.ifmo.ratatoile.dto.GuestOrderItemStatus
import com.ifmo.ratatoile.repository.*
import org.assertj.core.api.AssertionsForInterfaceTypes.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.test.context.TestPropertySource
import java.time.Instant

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
class KitchenQueueServiceTest {

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
  lateinit var guestOrderItemService: GuestOrderItemService

  @Autowired
  lateinit var kitchenQueueService: KitchenQueueService

  @Test
  fun `queue kinda worx`() {
    //given
    val guestId = 1
    val table = tableRepository.findByIdOrNull(1)!!
    val waiter = userRepository.findByIdOrNull(2L)!!
    guestRepository.save(Guest(
        guestId, Instant.now(), null, table, waiter)
    )
    val orderItems = guestOrderItemRepository.saveAll((0 until 5).map {
      GuestOrderItem(
          null,
          guestId,
          it,
          GuestOrderItemStatus.AWAITING_FOR_ACCEPTANCE.name)
    })
    val singleItem = orderItems[2]
    //when
    kitchenQueueRepository.saveAll(orderItems.map { KitchenQueueEntry(null, it) })
    guestOrderItemService.updateStatus(singleItem, GuestOrderItemStatus.IN_QUEUE)
    val queue = kitchenQueueRepository.findAll()
    //then
    assertThat(queue.unbox()).isEqualTo(orderItems)
    //when
    val queuePerWaiter = kitchenQueueService.getQueueForWaiter(waiter.id!!)
    //then
    assertThat(queuePerWaiter.items.map { it.entry }).isEqualTo(queue.unbox().map { it.toDto() })
    assertThat(queuePerWaiter.items.map { it.tableId }).allMatch { it == table.id }
    //when
    val queuePerAnotherWaiter = kitchenQueueService.getQueueForWaiter(999999L)
    //then
    assertThat(queuePerAnotherWaiter.items).isEmpty()
  }
}