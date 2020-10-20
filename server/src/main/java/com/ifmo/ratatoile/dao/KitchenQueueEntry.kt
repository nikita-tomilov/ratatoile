package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity(name = "kitchen_queue")
data class KitchenQueueEntry(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @ManyToOne(fetch = FetchType.EAGER, optional = false)
  @JoinColumn(name = "guest_order_item_id", nullable = false)
  val orderItem: GuestOrderItem
)

fun List<KitchenQueueEntry>.unbox() = this.map { it.orderItem }