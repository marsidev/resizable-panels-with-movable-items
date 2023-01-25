import { defaultGridGap, minTileSize } from '~/constants'

export const getColsByWidth = (width) => {
  const cols = Math.ceil(((width - minTileSize) / (minTileSize + defaultGridGap)) + 1)
  return cols
}

export const getRowsByHeight = (height) => {
  const rows = Math.ceil(((height - minTileSize) / (minTileSize + defaultGridGap)) + 1)
  return rows
}

export const getWidthByCols = (cols) => {
  const width = (minTileSize * cols) + ((cols - 1) * defaultGridGap)
  return width
}

export const getHeightByRows = (rows) => {
  const height = (minTileSize * rows) + ((rows - 1) * defaultGridGap)
  return height
}
