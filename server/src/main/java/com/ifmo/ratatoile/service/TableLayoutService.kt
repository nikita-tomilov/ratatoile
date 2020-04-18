package com.ifmo.ratatoile.service

import com.ifmo.ratatoile.dao.EatingTable
import mu.KLogging
import java.awt.Color
import java.awt.Graphics
import javax.swing.JFrame

object TableLayoutService : KLogging() {

  private val tableArrangement = listOf(
      "--===--===--===--===--===--===--===--===--",
      "|  x    x    x    x    x       xxxxxx    |",
      "|  x    x    x    x    x                 |",
      "|                                        |",
      "               -------      x   x   x    |",
      "               | BAR          x   x      |",
      "               -------      x   x   x    |",
      "| x   x   x     x   x   x                |",
      "|   x   x       x   x   x      xxxxxx    |",
      "| x   x   x                              |",
      "-------------------------------------------"
  )

  fun createArrangedTables(): List<EatingTable> {
    val roomWidth = tableArrangement.first().length
    val roomHeight = tableArrangement.size
    val ans = ArrayList<EatingTable>()
    (0 until roomHeight).forEach { y ->
      var currentTableWidth = 0
      var tableStartX = 0
      var tableStartY = 0
      (0 until roomWidth).forEach { x ->
        val c = tableArrangement.charAt(x, y)
        if (c != 'x') {
          if (currentTableWidth != 0) {
            val currentTableHeight = if (tableArrangement.charAt(x - 1, y + 1) == 'x') 2 else 1
            logger.debug{ "TABLE AT $tableStartX $tableStartY W $currentTableWidth H $currentTableHeight" }

            ans.add(
                EatingTable(
                    null,
                    tableStartX * 1.0f / roomWidth,
                    tableStartY * 1.0f / roomHeight,
                    currentTableWidth * 1.0f / roomWidth,
                    currentTableHeight * 1.0f / roomHeight,
                    currentTableWidth * currentTableHeight * 2,
                    when {
                      tableArrangement.charAt(x - 1, y - 1) == '=' -> "NEAR_WINDOW"
                      currentTableHeight == 2 -> "NEAR_BAR"
                      else -> "NORMAL"
                    }))
          }
          currentTableWidth = 0
          tableStartX = 0
          tableStartY = 0
        } else {
          if (tableArrangement.charAt(x, y - 1) != 'x') {
            currentTableWidth++
          }
          if (tableStartX == 0) {
            tableStartX = x
            tableStartY = y
          }
        }
      }
    }
    return ans
  }

  private fun List<String>.charAt(x: Int, y: Int) = this[y][x]

  @JvmStatic
  fun main(args: Array<String>) {
    val tables = createArrangedTables()
    val g = object : JFrame("kek") {
      init {
        setSize(840, 600)
        setLocationRelativeTo(null)
      }
      override fun paint(g: Graphics) {
        g.color = Color.WHITE
        g.fillRect(0, 0, 800, 600)

        tables.forEach {
          if (it.type == "NORMAL") g.color = Color.BLACK
          if (it.type == "NEAR_WINDOW") g.color = Color.RED
          if (it.type == "NEAR_BAR") g.color = Color.GREEN
          if (it.maxSeats > 4) g.color = Color.BLUE
          val x = it.guiX * 840
          val y = it.guiY * 300
          val w = it.guiW * 840
          val h = it.guiH * 300
          g.fillRect(x.toInt(), y.toInt(), w.toInt(), h.toInt())
        }
      }
    }
    g.isVisible = true
  }
}