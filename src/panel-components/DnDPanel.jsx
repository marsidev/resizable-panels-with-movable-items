import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
// import { useEffect } from 'react'
import { Container as MainContainer } from '~/commons'
import { FlexContainer, SortableItem } from '~/dnd-components'

export const DnDPanel = (props) => {
  const {
    animateLayoutChanges,
    getItemStyles = () => ({}),
    getNewIndex,
    handle = false,
    // isDisabled = () => false,
    removable,
    strategy = rectSortingStrategy,
    wrapperStyle = () => ({}),
    containerId,
    items,
    handleRemove,
  } = props
  const {
    setNodeRef,
    // over,
    // active,
  } = useDroppable({
    id: containerId,
  })

  // const activeContainer = active?.data?.current?.sortable.containerId
  // const overContainer = over?.data?.current?.sortable?.containerId
  // const canDrop = Boolean(activeContainer)
  //   && Boolean(overContainer)
  //   && (activeContainer === overContainer
  //     || (activeContainer === 'main' && overContainer === 'toolbar'))

  // useEffect(() => {
  //   console.log('useDroppable', { overContainer, activeContainer, canDrop, containerId })
  // }, [canDrop, containerId])

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
              // disabled={isDisabled(item.id)}
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
