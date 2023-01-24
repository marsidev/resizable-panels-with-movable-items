import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
import { forwardRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { GridContainer, SortableItem } from '~/dnd-components'

export const PanelContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-height: calc(100vh);
  background-color: var(--color-panel-background);
  justify-content: flex-start;
  height: 100%;
  border-radius: 0.5rem;
  overflow-y: auto;
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

  // useEffect(() => {
  //   containerId === 'main' && console.log({ columns })
  // }, [columns])

  return (
    <PanelContainer ref={ref} data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <GridContainer ref={setNodeRef} columns={columns}>
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
      </SortableContext>
    </PanelContainer>
  )
})
