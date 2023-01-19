import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Container as MainContainer } from '~/commons'
import { FlexContainer, SortableItem } from '~/dnd-components'
import { useMergeRefs } from '~/use-merge-refs'

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

  const [animRef] = useAutoAnimate()
  const refs = useMergeRefs(animRef, setNodeRef)

  return (
    <MainContainer data-id="panel-container">
      <SortableContext id={containerId} items={items} strategy={strategy}>
        <FlexContainer ref={refs}>
          {items.map((item, index) => (
            <SortableItem
              key={item.id}
              item={item}
              handle={handle}
              index={index}
              style={getItemStyles}
              wrapperStyle={wrapperStyle}
              disabled={false}
              onRemove={removable ? handleRemove : undefined}
              animateLayoutChanges={animateLayoutChanges}
              useDragOverlay={true}
              getNewIndex={getNewIndex}
              containerId={containerId}
            />
          ))}
        </FlexContainer>
      </SortableContext>
    </MainContainer>
  )
}
