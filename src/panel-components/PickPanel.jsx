import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { DndContext, DragOverlay, KeyboardSensor, MouseSensor, TouchSensor, closestCenter, defaultDropAnimationSideEffects, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from '~/store'
import { Container as MainContainer } from '~/commons'
import { GridContainer, Item, SortableItem, Wrapper } from '~/dnd-components'

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

export const PickPanel = (props) => {
  const {
    activationConstraint,
    animateLayoutChanges,
    adjustScale = false,
    Container = GridContainer,
    collisionDetection = closestCenter,
    coordinateGetter = sortableKeyboardCoordinates,
    dropAnimation = dropAnimationConfig,
    getItemStyles = () => ({}),
    getNewIndex,
    handle = false,
    isDisabled = () => false,
    measuring,
    modifiers,
    removable,
    renderItem,
    reorderItems = arrayMove,
    strategy = rectSortingStrategy,
    style,
    useDragOverlay = true,
    wrapperStyle = () => ({}),
  } = props

  const { toolbar: items } = useStore(s => s.items)
  const setItems = useStore(s => s.setToolbarItems)
  const handleRemove = useStore(s => s.removeToolbarItem)
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint,
    }),
    useSensor(TouchSensor, {
      activationConstraint,
    }),
    useSensor(KeyboardSensor, {
      scrollBehavior: 'smooth',
      coordinateGetter,
    }),
  )

  const getIndex = id => items.findIndex(i => i === id)
  // const getPosition = id => getIndex(id) + 1
  const activeIndex = activeId ? getIndex(activeId) : -1

  function handleDragStart({ active }) {
    if (!active) {
      return
    }
    setActiveId(active.id)
  }

  function handleDragEnd({ over }) {
    setActiveId(null)

    if (over) {
      const overIndex = getIndex(over.id)
      if (activeIndex !== overIndex) {
        const tempItems = [...items]
        const newItems = reorderItems(tempItems, activeIndex, overIndex)
        setItems(newItems)
      }
    }
  }

  return (
    <MainContainer>
      <DndContext
        // accessibility={{
        //   announcements,
        //   screenReaderInstructions,
        // }}
        sensors={sensors}
        collisionDetection={collisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
        measuring={measuring}
        modifiers={modifiers}
      >
        <Wrapper style={style} center>
          <SortableContext items={items} strategy={strategy}>
            <Container>
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
            </Container>
          </SortableContext>

          {useDragOverlay
            ? createPortal(
              <DragOverlay
                adjustScale={adjustScale}
                dropAnimation={dropAnimation}
              >
                {activeId
                  ? (
                    <Item
                      value={items[activeIndex]}
                      handle={handle}
                      renderItem={renderItem}
                      data-id={items[activeIndex]}
                      wrapperStyle={wrapperStyle({
                        active: { id: activeId },
                        index: activeIndex,
                        isDragging: true,
                        id: items[activeIndex],
                      })}
                      style={getItemStyles({
                        id: items[activeIndex],
                        index: activeIndex,
                        isSorting: activeId !== null,
                        isDragging: true,
                        overIndex: -1,
                        isDragOverlay: true,
                      })}
                      dragOverlay
                    />
                  )
                  : null}
              </DragOverlay>,
              document.body,
            )
            : null}
        </Wrapper>
      </DndContext>
    </MainContainer>
  )
}
