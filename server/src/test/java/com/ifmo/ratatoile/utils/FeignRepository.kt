package com.ifmo.ratatoile.utils

import com.ifmo.ratatoile.controller.UsersApi
import feign.Feign
import feign.auth.BasicAuthRequestInterceptor
import feign.gson.GsonDecoder
import feign.gson.GsonEncoder
import feign.okhttp.OkHttpClient
import java.io.Serializable
import java.util.concurrent.atomic.AtomicReference

class FeignRepository(
  private val url: String
) : Serializable {

  private val tokenRefDto = AtomicReference<OAuthResponseDto>()

  private fun getAccessToken(): String = tokenRefDto.get().access_token

  fun getRefreshToken(): String = tokenRefDto.get().refresh_token

  fun getToken(): OAuthResponseDto = tokenRefDto.get()

  fun getUserClient(): UsersApi = Feign.builder()
      .client(OkHttpClient())
      .encoder(GsonEncoder())
      .decoder(GsonDecoder())
      .requestInterceptor {
        it.header("Authorization", "Bearer ${getAccessToken()}")
      }
      .target(UsersApi::class.java, "$url/api/1.0/user")

  fun isTokenObtained() = (tokenRefDto.get() != null)

  fun obtainTokenByUsernamePassword(username: String, password: String): String {
    val oAuth2Client = buildOAuthClient()
    val response =
        oAuth2Client.getToken("grant_type=password&username=$username&password=$password")
    val token = response.access_token
    tokenRefDto.set(response)
    return token
  }

  private fun buildOAuthClient() = Feign.builder()
      .client(OkHttpClient())
      .decoder(GsonDecoder())
      .requestInterceptor {
        val bs = BasicAuthRequestInterceptor("oauth2-client", "oauth2-client-password")
        bs.apply(it)
        it.header("Content-Type", "application/x-www-form-urlencoded")
      }
      .target(OAuthApi::class.java, url)
}