import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { Container as MainContainer } from '~/commons'
import { FlexContainer, SortableItem } from '~/dnd-components'

export const PickPanel = (props) => {
  const {
    animateLayoutChanges,
    getItemStyles = () => ({}),
    getNewIndex,
    handle = false,
    isDisabled = () => false,
    removable,
    renderItem,
    strategy = rectSortingStrategy,
    wrapperStyle = () => ({}),
    id: containerId,
    items,
    handleRemove,
  } = props
  const { setNodeRef } = useDroppable({
    id: containerId,
  })

  return (
    <MainContainer data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <FlexContainer ref={setNodeRef}>
          {items.map((id, index) => (
            <SortableItem
              key={id}
              id={id}
              handle={handle}
              index={index}
              style={getItemStyles}
              wrapperStyle={wrapperStyle}
              disabled={isDisabled(id)}
              renderItem={renderItem}
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
