package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.repository.UserRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
class ContextLoadsTest {

  @Autowired
  lateinit var userRepository: UserRepository

  @Test
  fun contextLoads() {
    val allUsers = userRepository.findAll()
    assertThat(allUsers).isNotEmpty
  }
}