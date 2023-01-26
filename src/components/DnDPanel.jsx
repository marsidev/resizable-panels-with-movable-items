import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
import { forwardRef, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import useMeasure from 'react-use-measure'
import { GridContainer, SortableItem } from '~/components'
import { GridHelper } from '~/components/GridHelper'
import { useStore } from '~/store'
import { useMergeRefs } from '~/hooks/use-merge-refs'

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-height: 100vh;
  background-color: var(--color-panel-background);
  justify-content: flex-start;
  height: 100%;
  border-radius: 0.5rem;
  overflow-y: auto;
  position: relative;
`

export const DnDPanel = forwardRef((props, ref) => {
  const {
    animateLayoutChanges,
    strategy = rectSortingStrategy,
    containerId,
    items,
    columns,
  } = props
  const {
    setNodeRef,
  } = useDroppable({
    id: containerId,
  })
  const [showGridLines] = useStore(s => [s.showGridLines])
  const [measureRef, gridBounds] = useMeasure()
  const grid = useRef()
  const gridRefs = useMergeRefs(grid, setNodeRef, measureRef)

  return (
    <PanelContainer ref={ref} data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <GridContainer ref={gridRefs} columns={columns}>
          <AnimatePresence>
            {items.map((item, index) => (
              <SortableItem
                item={item}
                key={item.id}
                index={index}
                animateLayoutChanges={animateLayoutChanges}
                useDragOverlay={true}
                containerId={containerId}
              />
            ))}
          </AnimatePresence>
        </GridContainer>

        {showGridLines && containerId === 'main' && (
          <GridHelper
            numColumns={columns}
            mainGridRef={grid}
            gridBounds={gridBounds}
          />
        )}
      </SortableContext>
    </PanelContainer>
  )
})
