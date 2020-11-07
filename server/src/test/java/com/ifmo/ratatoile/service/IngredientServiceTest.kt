package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dto.IngredientCreateRequestDto
import com.ifmo.ratatoile.dto.IngredientDto
import com.ifmo.ratatoile.repository.IngredientRepository
import org.assertj.core.api.AssertionsForInterfaceTypes.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class IngredientServiceTest {

  @Autowired
  private lateinit var ingredientService: IngredientService

  @Autowired
  private lateinit var ingredientRepository: IngredientRepository

  @BeforeEach
  fun cleanup() {
    ingredientRepository.deleteAll()
  }

  @Test
  fun `can add ingredient`() {
    //given
    val rc = IngredientCreateRequestDto("test", 2000.0, "uom")
    //when
    val created = ingredientService.addIngredient(rc)
    val all = ingredientService.getIngredients()
    //then
    assertThat(all.ingredients).hasSize(1)
    assertThat(all.ingredients[0]).isEqualTo(created)
  }

  @Test
  fun `can delete ingredient`() {
    //given
    `can add ingredient`()
    val toDelete = ingredientService.getIngredients().ingredients.single()
    //when
    ingredientService.deleteIngredient(toDelete.id)
    val all = ingredientService.getIngredients()
    //then
    assertThat(all.ingredients).isEmpty()
  }

  @Test
  fun `can change ingredient amount`() {
    //given
    `can add ingredient`()
    val toUpdate = ingredientService.getIngredients().ingredients.single()
    //when
    val updated = ingredientService.changeIngredient(
        IngredientDto(
            toUpdate.id,
            toUpdate.name,
            toUpdate.warehouseAmount + 10.0,
            toUpdate.uom
        ))
    val all = ingredientService.getIngredients()
    //then
    assertThat(all.ingredients).hasSize(1)
    assertThat(all.ingredients[0]).isEqualTo(updated)
  }
}