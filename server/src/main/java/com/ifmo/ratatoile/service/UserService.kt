package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.User
import com.ifmo.ratatoile.dto.UserDto
import com.ifmo.ratatoile.repository.UserRepository
import com.ifmo.ratatoile.util.SecurityContextUtils
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class UserService(
  private val userRepository: UserRepository
) : UserDetailsService {

  @Transactional(readOnly = true)
  @Throws(UsernameNotFoundException::class)
  override fun loadUserByUsername(username: String): UserDetails {
    val user = loadUserByUsernameOrNull(username)
    if (user != null) {
      return user
    }
    throw UsernameNotFoundException(username)
  }

  fun loadUserByUsernameOrNull(username: String): User? {
    return userRepository.findByUsername(username)
  }

  fun me(): UserDto {
    val user = SecurityContextUtils.getUserFromContext()
    return UserDto(user.username, user.authorities.map { it.authority })
  }
}