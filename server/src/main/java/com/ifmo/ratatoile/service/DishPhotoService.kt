package com.ifmo.ratatoile.service

import com.google.common.io.Files
import com.ifmo.ratatoile.exception.NotFoundException
import com.ifmo.ratatoile.repository.DishPhotoRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.io.File

@Service
class DishPhotoService(
  private val dishPhotoRepository: DishPhotoRepository,
  @Value("\${dishPhotosDir}")
  private val parentDir: String
) {

  fun getImage(id: Int): ByteArray {
    val dishPhoto =
        dishPhotoRepository.findByIdOrNull(id) ?: throw NotFoundException("No img for id $id")
    val path = File(parentDir, dishPhoto.path)
    return Files.toByteArray(path)
  }
}