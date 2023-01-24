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
    handle = false,
    removable,
    strategy = rectSortingStrategy,
    wrapperStyle = () => ({}),
    containerId,
    items,
    handleRemove,
    columns,
  } = props
  const {
    setNodeRef,
  } = useDroppable({
    id: containerId,
  })

  return (
    <PanelContainer ref={ref} data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <GridContainer ref={setNodeRef} columns={columns}>
          <AnimatePresence>
            {items.map((item, index) => (
              <SortableItem
                item={item}
                items={items}
                key={item.id}
                handle={handle}
                index={index}
                wrapperStyle={wrapperStyle}
                disabled={false}
                onRemove={removable ? handleRemove : undefined}
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
