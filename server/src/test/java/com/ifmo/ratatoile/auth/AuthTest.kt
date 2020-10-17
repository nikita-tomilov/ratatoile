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
  fun `user can get token with correct credentials`() {
    //given
    val client = buildUserApiClient(USER_NAME, USER_CORRECT_PASSWORD)
    //when
    val me = client.me()
    //then
    assertThat(me.username).isEqualTo(USER_NAME)
  }

  @Test
  fun `user can not get token with incorrect credentials`() {
    val ex = assertThrows(FeignException::class.java) {
      buildUserApiClient(USER_NAME, USER_INCORRECT_PASSWORD)
    }
    assertThat(ex.status()).isEqualTo(400)
  }

  @Test
  fun `admin can trigger admin endpoints`() {
    //given
    val client = buildUserApiClient(ADMIN_NAME, ADMIN_PASSWORD)
    //when
    val me = client.meAsAdmin()
    //then
    assertThat(me.username).isEqualTo(ADMIN_NAME)
  }

  @Test
  fun `user can not trigger admin endpoints`() {
    val ex = assertThrows(FeignException::class.java) {
      val c = buildUserApiClient(USER_NAME, USER_CORRECT_PASSWORD)
      c.meAsAdmin()
    }
    assertThat(ex.status()).isEqualTo(403)
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

  companion object {
    private const val USER_NAME = "user1"
    private const val USER_CORRECT_PASSWORD = "user1password"
    private const val USER_INCORRECT_PASSWORD = "whatever"
    private const val ADMIN_NAME = "admin"
    private const val ADMIN_PASSWORD = "admin1234"
  }
}