package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dto.DishCreateRequestDto
import com.ifmo.ratatoile.dto.DishDto
import com.ifmo.ratatoile.repository.MenuEntryRepository
import org.assertj.core.api.AssertionsForInterfaceTypes.assertThat
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.TestPropertySource

@SpringBootTest
@TestPropertySource(properties = ["spring.config.location = classpath:test.yml"])
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class MenuServiceTest {

  @Autowired
  private lateinit var menuService: MenuService

  @Autowired
  private lateinit var dishService: DishService

  @Autowired
  private lateinit var menuEntryRepository: MenuEntryRepository

  private lateinit var dish1: DishDto

  private lateinit var dish2: DishDto

  @BeforeAll
  fun setupDishes() {
    dish1 = dishService.addDish(DishCreateRequestDto("1", "1", 1.0, null))
    dish2 = dishService.addDish(DishCreateRequestDto("2", "2", 1.0, null))
  }

  @BeforeEach
  fun cleanup() {
    menuEntryRepository.deleteAll()
  }

  @Test
  fun `can add menu entry`() {
    //when
    menuService.addEntryToMenu(dish1.id, 1)
    menuService.addEntryToMenu(dish2.id, 2)
    //then
    val menu = menuService.getCurrentMenu()
    assertThat(menu.menu).hasSize(2)
    assertThat(menu.menu[0].dish.name).isEqualTo(dish1.name)
    assertThat(menu.menu[1].dish.name).isEqualTo(dish2.name)
  }

  @Test
  fun `can remove menu entry`() {
    `can add menu entry`()
    val oldMenu = menuService.getCurrentMenu().menu
    val toDelete = oldMenu.single { it.dish.name == dish1.name }
    //when
    menuService.deleteEntryFromMenu(toDelete.id)
    //then
    val menu = menuService.getCurrentMenu()
    assertThat(menu.menu).hasSize(1)
    assertThat(menu.menu[0].dish.name).isEqualTo(dish2.name)
  }


}