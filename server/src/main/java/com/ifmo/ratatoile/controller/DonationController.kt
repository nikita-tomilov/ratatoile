package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dto.CriticDonationRequestDto
import com.ifmo.ratatoile.dto.InspectorDonationRequestDto
import com.ifmo.ratatoile.service.DonationService
import org.springframework.http.MediaType
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping(
    value = ["/api/1.0/donation/"],
    produces = [MediaType.APPLICATION_JSON_VALUE])
class DonationController(
  private val donationService: DonationService
) {

  @GetMapping("/critic/all")
  fun allCriticDonations() = donationService.getAllCriticDonations()

  @GetMapping("/critic/get/{id}")
  fun getCriticDonation(@PathVariable("id") id: Int) = donationService.getCriticDonation(id)

  @PostMapping("/critic/create")
  fun createCriticDonation(@RequestBody rq: CriticDonationRequestDto) =
      donationService.createCriticDonation(rq)

  @GetMapping("/critic/delete/{id}")
  fun deleteCriticDonation(@PathVariable("id") id: Int) = donationService.deleteCriticDonation(id)

  @GetMapping("/inspector/all")
  fun allInspectorDonations() = donationService.getAllInspectorDonations()

  @GetMapping("/inspector/get/{id}")
  fun getInspectorDonation(@PathVariable("id") id: Int) = donationService.getInspectorDonation(id)

  @PostMapping("/inspector/create")
  fun createInspectorDonation(@RequestBody rq: InspectorDonationRequestDto) =
      donationService.createInspectorDonation(rq)

  @GetMapping("/inspector/delete/{id}")
  fun deleteInspectorDonation(@PathVariable("id") id: Int) =
      donationService.deleteInspectorDonation(id)
}