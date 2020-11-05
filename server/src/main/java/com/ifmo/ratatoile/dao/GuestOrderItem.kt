package com.ifmo.ratatoile.dao

import com.ifmo.ratatoile.dto.GuestOrderItemStatus
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
  val dishId: Int,

  @Column(nullable = false)
  var status: String
) {
  fun getStatusEnum() = GuestOrderItemStatus.valueOf(status)
  fun setStatusEnum(status: GuestOrderItemStatus) {
    this.status = status.name
  }

  fun wasServed() = (this.getStatusEnum() == GuestOrderItemStatus.SERVED)
  fun wasPaid() = (this.getStatusEnum() == GuestOrderItemStatus.PAID)
}