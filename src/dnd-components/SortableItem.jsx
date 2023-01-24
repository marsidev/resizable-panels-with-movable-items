import { useSortable } from '@dnd-kit/sortable'
import { useEffect } from 'react'
import { Item } from '~/dnd-components'
import { useStore } from '~/store'

export const SortableItem = ({
  disabled,
  animateLayoutChanges,
  item,
  index,
  useDragOverlay,
  wrapperStyle,
  containerId,
}) => {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    over,
  } = useSortable({
    id: item.id,
    animateLayoutChanges,
    disabled,
  })

  const allItems = useStore(s => s.items)
  const items = allItems[containerId]

  const activeItem = items.find(item => item.id === active?.id)
  const overItem = items.find(item => item.id === over?.id)

  useEffect(() => {
    activeItem && overItem && isDragging && console.log('useSortable', { overItem, activeItem, isDragging, isSorting, transform, transition })
  }, [activeItem, overItem, isDragging])

  return (
    <Item
      ref={setNodeRef}
      item={item}
      disabled={disabled}
      dragging={isDragging}
      sorting={isSorting}
      handleProps={item.movable ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      transform={transform}
      transition={transition}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, item })}
      listeners={listeners}
      dragOverlay={!useDragOverlay && isDragging}
      containerId={containerId}
      {...attributes}
    />
  )
}
