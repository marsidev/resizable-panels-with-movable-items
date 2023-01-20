import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
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

export const DnDPanel = (props) => {
  const {
    animateLayoutChanges,
    getItemStyles = () => ({}),
    getNewIndex,
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
    <PanelContainer data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <GridContainer ref={setNodeRef} columns={columns}>
          {items.map((item, index) => (
            <SortableItem
              item={item}
              key={item.id}
              handle={handle}
              index={index}
              style={getItemStyles}
              wrapperStyle={wrapperStyle}
              disabled={false}
              onRemove={removable ? handleRemove : undefined}
              animateLayoutChanges={animateLayoutChanges}
              useDragOverlay={true}
              getNewIndex={getNewIndex}
            />
          ))}
        </GridContainer>
      </SortableContext>
    </PanelContainer>
  )
}
