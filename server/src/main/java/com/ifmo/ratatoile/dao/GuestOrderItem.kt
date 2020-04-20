package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "guest_order_item")
data class GuestOrderItem(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val guestId: Int,

  @Column(nullable = false)
  val dishId: Int
)