import { AnimatePresence, motion } from 'framer-motion'
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

const Helper = ({ numColumns, gridBounds, itemsCount }) => {
  const [gridRows, setGridRows] = useState()

  useEffect(() => {
    if (!gridBounds.width || !gridBounds.height) return

    // const gridHeight = mainGridRef.current.scrollHeight - 2 * tilesContainerPadding
    const gridHeight = gridBounds.height - 2 * tilesContainerPadding
    const rows = Math.ceil((gridHeight + defaultGridGap) / (minTileSize + defaultGridGap))

    // const gridWidth = gridBounds.width - 2 * tilesContainerPadding
    // const cols = Math.ceil((gridWidth + defaultGridGap) / (minTileSize + defaultGridGap))

    setGridRows(rows)
  }, [numColumns, gridBounds, itemsCount])

  return (
    <Wrapper
      $numColumns={numColumns || 1}
      $numRows={gridRows || 1}
      $gridHeight={gridBounds.height}
      $gridWidth={gridBounds.width}
      data-id="grid-helper"
      transition={{ duration: 0.25 }}
    >
      <AnimatePresence>
        {Array.from({ length: numColumns * gridRows })
          .map((_, i) => (
            <motion.div
              key={i}
              data-id="grid-helper-item"
              layout
              layoutId={`grid-helper-item-${i}`}
              exit={{
                opacity: 0,
                scale: 0,
                transition: {
                  duration: 0.25,
                },
              }}
              transition={{
                duration: 0.25,
                easings: {
                  type: 'spring',
                },
                scale: {
                  duration: 0.25,
                },
                zIndex: {
                  delay: 0.25,
                },
                // type: 'spring',
                // stiffness: 350,
                // damping: 25,
              }}
              animate={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
                zIndex: 0,
              }}
            />
          ))}
      </AnimatePresence>
    </Wrapper>
  )
}

export const GridHelper = memo(Helper)
