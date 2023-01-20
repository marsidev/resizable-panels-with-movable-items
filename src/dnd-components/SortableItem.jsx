import { useSortable } from '@dnd-kit/sortable'
import { useEffect } from 'react'
import { Item } from '~/dnd-components'

export const SortableItem = ({
  disabled,
  animateLayoutChanges,
  getNewIndex,
  handle,
  item,
  items,
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
    over,
  } = useSortable({
    id: item.id,
    animateLayoutChanges,
    disabled,
    getNewIndex,
  })

  const activeItem = items.find(item => item.id === active?.id)
  const overItem = items.find(item => item.id === over?.id)

  useEffect(() => {
    activeItem && overItem && isDragging && console.log('useSortable', { overItem, activeItem, isDragging, isSorting, transform, transition })
  }, [activeItem, overItem, isDragging])

  return (
    <Item
      ref={setNodeRef}
      item={item}
      fadeIn={false}
      // item={isSorting && overItem ? { ...item, style: { ...item.style, backgroundColor: 'red' } } : item}
      // item={isDragging && overItem ? overItem : item}
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
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, item })}
      listeners={listeners}
      dragOverlay={!useDragOverlay && isDragging}
      {...attributes}
    />
  )
}
