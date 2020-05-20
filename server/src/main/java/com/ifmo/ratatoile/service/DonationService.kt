package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.CriticDonation
import com.ifmo.ratatoile.dao.InspectorDonation
import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.*
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.CriticDonationRepository
import com.ifmo.ratatoile.repository.InspectorDonationRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class DonationService(
  private val inspectorDonationRepository: InspectorDonationRepository,
  private val criticDonationRepository: CriticDonationRepository
) {

  fun getAllCriticDonations(): CriticDonationsDto {
    return CriticDonationsDto(criticDonationRepository.findAll().map { it.toDto() })
  }

  fun createCriticDonation(rq: CriticDonationRequestDto): CriticDonationDto {
    val new =
        CriticDonation(null, rq.amount, rq.criticName, rq.reason, Instant.ofEpochMilli(rq.date))
    val saved = criticDonationRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun getCriticDonation(id: Int): CriticDonation {
    return criticDonationRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no donation for id $id")
  }

  fun deleteCriticDonation(id: Int): CriticDonationDto {
    val d = getCriticDonation(id)
    criticDonationRepository.deleteById(id)
    return d.toDto()
  }

  fun getAllInspectorDonations(): InspectorDonationsDto {
    return InspectorDonationsDto(inspectorDonationRepository.findAll().map { it.toDto() })
  }

  fun createInspectorDonation(rq: InspectorDonationRequestDto): InspectorDonationDto {
    val new =
        InspectorDonation(null, rq.amount, rq.reason, Instant.ofEpochMilli(rq.date))
    val saved = inspectorDonationRepository.saveAndFlush(new)
    return saved.toDto()
  }

  fun getInspectorDonation(id: Int): InspectorDonation {
    return inspectorDonationRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no donation for id $id")
  }

  fun deleteInspectorDonation(id: Int): InspectorDonationDto {
    val d = getInspectorDonation(id)
    inspectorDonationRepository.deleteById(id)
    return d.toDto()
  }
}