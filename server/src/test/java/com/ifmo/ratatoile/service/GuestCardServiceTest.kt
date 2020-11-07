package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dto.GuestCardRequestDto
import com.ifmo.ratatoile.repository.GuestCardRepository
import org.assertj.core.api.AssertionsForInterfaceTypes.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class GuestCardServiceTest {

  @Autowired
  private lateinit var guestCardService: GuestCardService

  @Autowired
  private lateinit var guestCardRepository: GuestCardRepository

  @BeforeEach
  fun cleanup() {
    guestCardRepository.deleteAll()
  }

  @Test
  fun `can add guest card`() {
    //given
    val rc = GuestCardRequestDto("test", "test", 1L, 5)
    //when
    val created = guestCardService.createGuestCard(rc)
    val all = guestCardService.getAllGuestCards()
    //then
    assertThat(all).hasSize(1)
    assertThat(all.single()).isEqualTo(created)
  }

  @Test
  fun `can delete guest card`() {
    //given
    `can add guest card`()
    val toDelete = guestCardService.getAllGuestCards().single()
    //when
    guestCardService.deleteGuestCard(toDelete.id ?: error("should-never-happen"))
    val all = guestCardService.getAllGuestCards()
    //then
    assertThat(all).isEmpty()
  }
}