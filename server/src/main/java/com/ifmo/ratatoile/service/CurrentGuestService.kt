package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.toDto
import com.ifmo.ratatoile.dto.GuestDto
import com.ifmo.ratatoile.dto.GuestsDto
import com.ifmo.ratatoile.repository.GuestRepository
import org.springframework.stereotype.Service

@Service
class CurrentGuestService(
  private val guestRepository: GuestRepository,
  private val userService: UserService
) {

  private fun currentGuests(): GuestsDto =
      GuestsDto(guestRepository.findAllByLeavedAtIsNull().map { it.toDto() })

  fun currentBusyTables(): Set<Int> = currentGuests().guests.map { it.tableId }.toSet()

  fun currentGuestsForCurrentUser(): Map<Int, GuestsDto> {
    val me = userService.myId()
    val filterPredicate: (GuestDto) -> Boolean = if (userService.IAmAdmin()) {
      { true }
    } else {
      { it.waiterId == me }
    }
    return currentGuests().guests
        .filter(filterPredicate)
        .groupBy { it.tableId }
        .mapValues { GuestsDto(it.value) }
  }
}