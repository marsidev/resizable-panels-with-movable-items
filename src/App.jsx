import { Panel, PanelGroup } from 'react-resizable-panels'
import styled from 'styled-components'
import { DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, closestCorners, defaultDropAnimationSideEffects, useSensor, useSensors } from '@dnd-kit/core'
import { defaultAnimateLayoutChanges, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { Item } from '~/dnd-components'
import { DnDPanel, ResizeHandle } from '~/panel-components'
import { useStore } from '~/store'

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const mainPanelProps = {
  containerId: 'main',
  wrapperStyle: () => ({
    width: 100,
    height: 100,
  }),
  animateLayoutChanges: args => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  removable: true,
  handle: true,
}

const toolbarPanelProps = {
  containerId: 'toolbar',
  wrapperStyle: () => ({
    width: 100,
    height: 100,
  }),
  animateLayoutChanges: args => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  removable: false,
  handle: true,
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
}

function App() {
  const [activeItem, setActiveItem] = useStore(s => [s.activeItem, s.setActiveItem])
  const [items, setItems] = useStore(s => [s.items, s.setItems, s.setMainItems, s.setToolbarItems])
  const [removeMainItem, removeToolbarItem] = useStore(s => [s.removeMainItem, s.removeToolbarItem])
  const [moveMainItems, moveToolbarItems] = useStore(s => [s.moveMainItems, s.moveToolbarItems])
  const { toolbar: toolbarItems, main: mainItems } = items

  const getIndex = (id, containerId) => items[containerId].findIndex(item => item.id === id)

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      scrollBehavior: 'smooth',
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  function findContainer(id) {
    if (id in items) {
      return id
    }

    return Object.keys(items).find(key => items[key].map(item => item.id).includes(id))
  }

  const getItem = (id) => {
    if (!id) return null
    const container = findContainer(id)
    const activeItem = items[container].find(item => item.id === id)
    return activeItem
  }

  function handleDragStart({ active }) {
    if (!active) return
    const activeContainer = findContainer(active.id)
    const item = getItem(active.id)
    setActiveItem(item)
    console.log({ handler: 'dragStart', activeContainer, activeItemBefore: activeItem, activeItemAfter: item })
  }

  function handleDragEnd({ active, over }) {
    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (
      !activeContainer
      || !overContainer
      || activeContainer !== overContainer
    ) {
      return
    }

    const activeIndex = getIndex(active.id, activeContainer)
    const overIndex = getIndex(over.id, overContainer)
    const overItem = getItem(over.id)

    console.log({ handler: 'dragEnd', activeContainer, overContainer, activeItem, overItem })

    if (activeIndex !== overIndex) {
      if (activeContainer === 'main') {
        moveMainItems(activeIndex, overIndex)
      }
      if (activeContainer === 'toolbar') {
        moveToolbarItems(activeIndex, overIndex)
      }
    }

    setActiveItem(null)
  }

  function handleDragOver({ active, over, draggingRect }) {
    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (
      !activeContainer
      || !overContainer
      || activeContainer === overContainer
      || (activeContainer !== 'toolbox' && overContainer !== 'main')
    ) {
      // console.log('invalid dropping', { handler: 'dragOver', activeContainer, overContainer, activeId: active.id, overId: over.id })
      return
    }

    const activeItems = items[activeContainer]
    const overItems = items[overContainer]
    const activeIndex = getIndex(active.id, activeContainer)
    const overIndex = getIndex(over.id, overContainer)
    const overItem = getItem(over.id)

    console.log({ handler: 'dragOver', activeContainer, overContainer, activeItem, overItem, activeItems, overItems })

    let newIndex
    if (over.id in items) {
      // We're at the root droppable of a container
      newIndex = overItems.length + 1
    }
    else {
      const isBelowLastItem
        = over
        && overIndex === overItems.length - 1
        && draggingRect?.offsetTop > over.rect.offsetTop + over.rect.height

      const modifier = isBelowLastItem ? 1 : 0

      newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
    }

    const newItems = {
      ...items,
      [activeContainer]: [
        ...items[activeContainer].filter(item => item.id !== active.id),
      ],
      [overContainer]: [
        ...items[overContainer].slice(0, newIndex),
        items[activeContainer][activeIndex], // active.id
        ...items[overContainer].slice(newIndex),
      ],
    }

    // const newItems = {
    //   ...items,
    //   main: [
    //     ...items.main.slice(0, newIndex),
    //     items.toolbar[activeIndex],
    //     ...items.main.slice(newIndex),
    //   ],
    // }

    setItems(newItems)
  }

  return (
    <Container>
      <DndContext
        // announcements={defaultAnnouncements}
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        <PanelGroup autoSaveId="example-v5" direction="horizontal">
          <Panel defaultSize={80} order={1}>
            <DnDPanel {...mainPanelProps} items={mainItems} handleRemove={removeMainItem} />
          </Panel>

          <ResizeHandle />

          <Panel order={2}>
            <DnDPanel {...toolbarPanelProps} items={toolbarItems} handleRemove={removeToolbarItem} />
          </Panel>
        </PanelGroup>

        {createPortal(
          <DragOverlay
            adjustScale={true}
            dropAnimation={dropAnimationConfig}
            // modifiers={[restrictToWindowEdges]}
          >
            {activeItem
              ? (
                <Item
                  value={activeItem.value}
                  handle={true}
                  data-id={activeItem.id}
                  wrapperStyle={{
                    width: 100,
                    height: 100,
                  }}
                  dragOverlay
                />
              )
              : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>
    </Container>
  )
}

export default App
