package com.ifmo.ratatoile.auth

import com.ifmo.ratatoile.controller.UsersApi
import com.ifmo.ratatoile.utils.FeignRepository
import feign.FeignException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.web.server.LocalServerPort
import org.springframework.test.context.TestPropertySource

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
class AuthTest {

  @LocalServerPort
  var port: Int = 0

  @Test
  fun `waiter can get token with correct credentials`() {
    //given
    val client = buildUserApiClient(USER_NAME, USER_CORRECT_PASSWORD)
    //when
    val me = client.me()
    //then
    assertThat(me.username).isEqualTo(USER_NAME)
  }

  @Test
  fun `waiter can not get token with incorrect credentials`() {
    val ex = assertThrows(FeignException::class.java) {
      buildUserApiClient(USER_NAME, USER_INCORRECT_PASSWORD)
    }
    assertThat(ex.status()).isEqualTo(400)
  }

  @Test
  fun `manager can trigger manager endpoints`() {
    //given
    val client = buildUserApiClient(MANAGER_NAME, MANAGER_PASSWORD)
    //when
    val me = client.meAsManager()
    //then
    assertThat(me.username).isEqualTo(MANAGER_NAME)
  }

  @Test
  fun `waiter can not trigger manager endpoints`() {
    val ex = assertThrows(FeignException::class.java) {
      val c = buildUserApiClient(USER_NAME, USER_CORRECT_PASSWORD)
      c.meAsManager()
    }
    assertThat(ex.status()).isEqualTo(403)
  }

  @Test
  fun `the roles were set up correctly`() {
    assertThat(getRoles("admin", "admin1234")).isEqualTo(setOf("WAITER", "MANAGER", "COOK", "CHEF"))
    assertThat(getRoles("user1", "user1password")).isEqualTo(setOf("WAITER"))
    assertThat(getRoles("user2", "user2password")).isEqualTo(setOf("WAITER"))
    assertThat(getRoles("cook1", "cook1")).isEqualTo(setOf("COOK"))
    assertThat(getRoles("cook2", "cook2")).isEqualTo(setOf("COOK"))
    assertThat(getRoles("manager", "manager")).isEqualTo(setOf("WAITER", "MANAGER"))
    assertThat(getRoles("chef", "chef")).isEqualTo(setOf("COOK", "CHEF"))
  }

  fun buildUserApiClient(username: String, password: String): UsersApi {
    val fr = buildFeignRepository(username, password)
    return fr.getUserClient()
  }

  fun buildFeignRepository(username: String, password: String): FeignRepository {
    val fr = FeignRepository("http://localhost:$port")
    fr.obtainTokenByUsernamePassword(username, password)
    return fr
  }

  fun getRoles(username: String, password: String): Set<String> {
    val u = buildUserApiClient(username, password)
    return u.me().roles.toSet()
  }

  companion object {
    private const val USER_NAME = "user1"
    private const val USER_CORRECT_PASSWORD = "user1password"
    private const val USER_INCORRECT_PASSWORD = "whatever"
    private const val MANAGER_NAME = "manager"
    private const val MANAGER_PASSWORD = "manager"
  }
}