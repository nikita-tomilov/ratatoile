package com.ifmo.ratatoile.dao

import javax.persistence.*

@Entity
@Table(name = "dish_photo")
data class DishPhoto(

  @Id
  @Column(nullable = false)
  val dishId: Long,

  @Column(nullable = false)
  val image: ByteArray
) {
  override fun equals(other: Any?): Boolean {
    if (this === other) return true
    if (javaClass != other?.javaClass) return false

    other as DishPhoto

    if (dishId != other.dishId) return false
    if (!image.contentEquals(other.image)) return false

    return true
  }

  override fun hashCode(): Int {
    var result = dishId
    result = 31 * result + image.contentHashCode()
    return result.toInt()
  }
}