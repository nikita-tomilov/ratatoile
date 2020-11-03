package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.GuestCard
import com.ifmo.ratatoile.dto.GuestCardRequestDto
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.GuestCardRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class GuestCardService(
  @Autowired
  private val guestCardRepository: GuestCardRepository
) {
  fun getAllGuestCards(): List<GuestCard> {
    return guestCardRepository.findAll()
  }

  fun createGuestCard(rq: GuestCardRequestDto): GuestCard {
    val new =
        GuestCard(null, rq.fullName, rq.phone, Instant.ofEpochMilli(rq.birthday), rq.percentage)
    return guestCardRepository.saveAndFlush(new)
  }

  fun getGuestCard(id: Int): GuestCard {
    return guestCardRepository.findByIdOrNull(id)
      ?: throw NotFoundException("no donation for id $id")
  }

  //TODO: make guestCardId == null in PaidOrder
  fun deleteGuestCard(id: Int): GuestCard {
    val d = getGuestCard(id)
    guestCardRepository.deleteById(id)
    return d
  }

}