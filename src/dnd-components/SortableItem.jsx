import { useSortable } from '@dnd-kit/sortable'
import { Item } from '~/dnd-components'

export const SortableItem = ({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  item,
  index,
  onRemove,
  style,
  useDragOverlay,
  wrapperStyle,
}) => {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({
    id: item.id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  })

  return (
    <Item
      ref={setNodeRef}
      item={item}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      style={style({
        index,
        id: item.id,
        isDragging,
        isSorting,
        overIndex,
      })}
      onRemove={onRemove ? () => onRemove(item.id) : undefined}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id: item.id })}
      listeners={listeners}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  )
}
