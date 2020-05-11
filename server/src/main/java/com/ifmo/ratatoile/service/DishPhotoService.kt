package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.DishPhoto
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.DishPhotoRepository
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class DishPhotoService(
  private val dishPhotoRepository: DishPhotoRepository
) {

  fun getImage(dishId: Int): ByteArray {
    val dishPhoto =
        dishPhotoRepository.findByIdOrNull(dishId.toLong())
          ?: throw NotFoundException("No img for id $dishId")
    return dishPhoto.image
  }

  fun saveImage(dishId: Int, data: ByteArray): ImageSavedResponseDto {
    val new = DishPhoto(dishId.toLong(), data)
    val saved = dishPhotoRepository.saveAndFlush(new)
    return ImageSavedResponseDto(saved.dishId, saved.image.size)
  }

  fun getImageId(dishId: Int): Int? {
    val dishPhoto =
        dishPhotoRepository.findByIdOrNull(dishId.toLong())
    return dishPhoto?.dishId?.toInt()
  }
}

data class ImageSavedResponseDto(
  val dishId: Long,
  val imageSize: Int
)