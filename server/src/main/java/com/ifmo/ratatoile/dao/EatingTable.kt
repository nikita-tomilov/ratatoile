package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "eating_table")
data class EatingTable(
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(nullable = false)
  var id: Int? = null,

  @Column(name = "gui_x", nullable = false)
  val guiX: Float,

  @Column(name = "gui_y", nullable = false)
  val guiY: Float,

  @Column(name = "gui_w", nullable = false)
  val guiW: Float,

  @Column(name = "gui_h", nullable = false)
  val guiH: Float,

  @Column(name = "max_seats", nullable = false)
  val maxSeats: Int,

  @Column(nullable = false)
  val type: String
) {
  fun isNearWindow() = (type == "NEAR_WINDOW")
  fun isNearBar() = (type == "NEAR_BAR")
}