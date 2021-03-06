//Display/UI
import {
  TILE_STATUSES,
  createBoard,
  markTile,
  revealTile,
  checkLose,
  checkWin,
} from "./minesweeper.js"

const BOARD_SIZE = 10
const NUMBER_OF_MINES = 10

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const minesLeftNumber = document.querySelector("[data-mines-left-number]")
const subTextElement = document.querySelector(".subtext")

board.forEach((row) => {
  row.forEach((tile) => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })

    tile.element.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})

boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeftNumber.textContent = NUMBER_OF_MINES

function listMinesLeft() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TILE_STATUSES.MARKED).length
    )
  }, 0)

  minesLeftNumber.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)

  if (win || lose) {
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }

  if (win) {
    subTextElement.textContent = "You Win!"
  }

  if (lose) {
    subTextElement.textContent = "You Lose!"
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}

function stopProp(e) {
  e.stopImmediatePropagation()
}
