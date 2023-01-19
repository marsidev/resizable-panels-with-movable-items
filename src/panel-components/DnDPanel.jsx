import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import styled from 'styled-components'
import { FlexContainer, SortableItem } from '~/dnd-components'

export const MainContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-height: calc(100vh);
  background-color: var(--color-panel-background);
  justify-content: center;
  padding: 16px;
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
  } = props
  const {
    setNodeRef,
  } = useDroppable({
    id: containerId,
  })

  return (
    <MainContainer data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <FlexContainer ref={setNodeRef}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              id={item.id}
              value={item.value}
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
        </FlexContainer>
      </SortableContext>
    </MainContainer>
  )
}
