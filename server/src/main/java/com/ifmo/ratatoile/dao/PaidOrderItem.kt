package com.ifmo.ratatoile.dao

import java.math.BigDecimal
import javax.persistence.*

@Entity
@Table(name = "paid_order_item")
data class PaidOrderItem(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val orderItemId: Int,

  @Column(nullable = false)
  val originalPrice: BigDecimal,

  @Column(nullable = false)
  val paidPrice: BigDecimal,

  @Column(nullable = false)
  var guestCardId: Int? = null
)