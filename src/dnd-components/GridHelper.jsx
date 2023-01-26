import { memo, useEffect, useState } from 'react'
import styled from 'styled-components'
import { defaultGridGap, minTileSize, tilesContainerPadding } from '~/constants'

const Wrapper = styled.div`
  position: absolute;

  /* inset: 0; */
  z-index: 0;
  display: grid;
  grid-template-columns: ${({ $numColumns }) => `repeat(${$numColumns}, 1fr)`};
  /* grid-template-rows: ${({ $numRows }) => `repeat(${$numRows}, 1fr)}`}; */
  /* grid-auto-rows: ${minTileSize}px; */
  /* grid-auto-flow: row; */
  grid-gap: ${defaultGridGap}px;
  user-select: none;
  pointer-events: none;

  margin-top: 14px;
  margin-bottom: 14px;
  padding: ${tilesContainerPadding}px;
  width: ${({ $gridWidth }) => `${$gridWidth - 2 * tilesContainerPadding}px`};
  height: ${({ $gridHeight }) => `${$gridHeight - 2 * tilesContainerPadding}px`};

  & > div {
    border: 1px solid red;
    background-color: rgba(255, 0, 0, 0.2);
    width: ${minTileSize - 1.6}px;
    height: ${minTileSize - 1.6}px;
  }
`

const Helper = ({ numColumns, mainGridRef, gridBounds }) => {
  const [gridRows, setGridRows] = useState()

  useEffect(() => {
    if (!mainGridRef.current) return

    // const gridScrollWidth = mainGridRef.current.offsetWidth
    // const cols = Math.floor((gridScrollWidth + defaultGridGap) / (minTileSize + defaultGridGap))
    const gridScrollHeight = mainGridRef.current.scrollHeight
    const rows = Math.floor((gridScrollHeight + defaultGridGap) / (minTileSize + defaultGridGap))

    // console.log({
    //   grid: mainGridRef.current,
    //   cols,
    //   rows,
    // })

    setGridRows(rows)
  }, [mainGridRef, numColumns])

  return (
    <Wrapper
      $numColumns={numColumns || 1}
      $numRows={gridRows || 1}
      $gridHeight={gridBounds.height}
      $gridWidth={gridBounds.width}
      data-id="svg-grid-helper"
    >
      {Array.from({ length: numColumns * gridRows }).map(i => <div key={i} data="svg-grid-helper-item" />)}
    </Wrapper>
  )
}

export const GridHelper = memo(Helper)
