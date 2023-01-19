import { useSortable } from '@dnd-kit/sortable'
import { useEffect } from 'react'
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
  containerId,
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

  useEffect(() => {
    if (!active) return
    if (!over) return
    // const activeId = active?.data?.current?.sortable?.items[active?.data?.current?.sortable?.index]
    // const overId = over?.data?.current?.sortable?.items[over?.data?.current?.sortable?.index]
    const activeId = active?.data?.id
    const overId = over?.data?.id

    if (activeId === item.id || overId === item.id) {
      console.log({ containerId, item, active, transform, over, transition, activeId, overId })
    }
  }, [containerId, item, active, transform, over, transition])

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
