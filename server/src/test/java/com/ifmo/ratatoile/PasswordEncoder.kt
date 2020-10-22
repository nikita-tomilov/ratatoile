package com.ifmo.ratatoile

import com.ifmo.ratatoile.config.PasswordEncoders

fun main() {
  val pe = PasswordEncoders()
  val e = pe.oauthClientPasswordEncoder()
  while (true) {
    val s = readLine()
    println("'$s'")
    println(e.encode(s))
  }
}