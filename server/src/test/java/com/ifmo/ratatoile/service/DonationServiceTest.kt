package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dto.CriticDonationRequestDto
import com.ifmo.ratatoile.dto.InspectorDonationRequestDto
import com.ifmo.ratatoile.repository.InspectorDonationRepository
import org.assertj.core.api.AssertionsForInterfaceTypes.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource
import java.time.Instant

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DonationServiceTest {

  @Autowired
  private lateinit var donationService: DonationService

  @Autowired
  private lateinit var inspectorDonationRepository: InspectorDonationRepository

  @Autowired
  private lateinit var criticDonationRepository: InspectorDonationRepository

  @BeforeEach
  fun cleanup() {
    inspectorDonationRepository.deleteAll()
    criticDonationRepository.deleteAll()
  }

  @Test
  fun `can add critic donation`() {
    //given
    val rc = CriticDonationRequestDto(1000, "name", "reason", Instant.now().toEpochMilli())
    //when
    val created = donationService.createCriticDonation(rc)
    val all = donationService.getAllCriticDonations()
    //then
    assertThat(all.donations).hasSize(1)
    assertThat(all.donations[0]).isEqualTo(created)
  }

  @Test
  fun `can delete critic donation`() {
    //given
    `can add critic donation`()
    val toDelete = donationService.getAllCriticDonations().donations.single()
    //when
    donationService.deleteCriticDonation(toDelete.id)
    val all = donationService.getAllCriticDonations()
    //then
    assertThat(all.donations).isEmpty()
  }

  @Test
  fun `can add inspector donation`() {
    //given
    val ic = InspectorDonationRequestDto(1000, "name", Instant.now().toEpochMilli())
    //when
    val created = donationService.createInspectorDonation(ic)
    val all = donationService.getAllInspectorDonations()
    //then
    assertThat(all.donations).hasSize(1)
    assertThat(all.donations[0]).isEqualTo(created)
  }

  @Test
  fun `can delete inspector donation`() {
    //given
    `can add inspector donation`()
    val toDelete = donationService.getAllInspectorDonations().donations.single()
    //when
    donationService.deleteInspectorDonation(toDelete.id)
    val all = donationService.getAllInspectorDonations()
    //then
    assertThat(all.donations).isEmpty()
  }
}