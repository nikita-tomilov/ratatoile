package com.ifmo.ratatoile.controller

import com.ifmo.ratatoile.dto.UserDto
import com.ifmo.ratatoile.service.UserService
import org.springframework.http.MediaType
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping(value = ["/api/1.0/user/"], produces = [MediaType.APPLICATION_JSON_VALUE])
class UsersController(
  private val userService: UserService
) {

  @GetMapping("/me")
  fun me(): UserDto = userService.me()

  @GetMapping("/meAsAdmin")
  @PreAuthorize("hasAuthority('ADMIN')")
  fun meAsAdmin(): UserDto = userService.me()
}