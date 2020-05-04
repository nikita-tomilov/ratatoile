package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "menu_entry")
data class MenuEntry(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(nullable = false)
  val dishId: Int,

  @Column(nullable = false)
  val addedAt: Long,

  @Column(nullable = false)
  val menuPosition: Int
)