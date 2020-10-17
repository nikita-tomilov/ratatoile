package com.ifmo.ratatoile.utils

import feign.RequestLine

interface OAuthApi {
  @RequestLine("POST /oauth/token")
  fun getToken(request: String): OAuthResponseDto
}

data class OAuthResponseDto(
  val access_token: String,
  val token_type: String,
  val refresh_token: String,
  val expires_in: Long,
  val scope: String
)