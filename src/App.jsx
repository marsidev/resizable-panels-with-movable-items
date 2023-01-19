import { Panel, PanelGroup } from 'react-resizable-panels'
import styled from 'styled-components'
import { DndContext, DragOverlay, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, closestCorners, defaultDropAnimationSideEffects, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, defaultAnimateLayoutChanges, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
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
  id: 'main',
  wrapperStyle: () => ({
    width: 100,
    height: 100,
  }),
  animateLayoutChanges: args => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  removable: true,
  handle: true,
}

const toolbarPanelProps = {
  id: 'toolbar',
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
  const [activeId, setActiveId] = useStore(s => [s.activeId, s.setActiveId])
  const [items, setItems, setMainItems, setToolbarItems] = useStore(s => [s.items, s.setItems, s.setMainItems, s.setToolbarItems])
  const [removeMainItem, removeToolbarItem] = useStore(s => [s.removeMainItem, s.removeToolbarItem])
  const { toolbar: toolbarItems, main: mainItems } = items

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

    return Object.keys(items).find(key => items[key].includes(id))
  }

  function handleDragStart({ active }) {
    if (!active) return
    console.log({ handler: 'dragStart', active })
    setActiveId(active.id)
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

    const activeIndex = items[activeContainer].indexOf(active.id)
    const overIndex = items[overContainer].indexOf(over.id)

    console.log({ handler: 'dragEnd', activeContainer, overContainer, activeIndex, overIndex })

    if (activeIndex !== overIndex) {
      if (activeContainer === 'main') {
        const tempItems = [...mainItems]
        const newItems = arrayMove(tempItems, activeIndex, overIndex)
        setMainItems(newItems)
      }
      if (activeContainer === 'toolbar') {
        const tempItems = [...toolbarItems]
        const newItems = arrayMove(tempItems, activeIndex, overIndex)
        setToolbarItems(newItems)
      }
    }

    setActiveId(null)
  }

  function handleDragOver({ active, over, draggingRect }) {
    const activeContainer = findContainer(active.id)
    const overContainer = findContainer(over.id)

    if (
      !activeContainer
      || !overContainer
      || activeContainer === overContainer
    ) {
      return
    }

    const activeItems = items[activeContainer]
    const overItems = items[overContainer]
    const activeIndex = activeItems.indexOf(active.id)
    const overIndex = overItems.indexOf(over.id)

    console.log({ handler: 'dragOver', activeContainer, overContainer, activeItems, overItems, activeIndex, overIndex })

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
        ...items[activeContainer].filter(item => item !== active.id),
      ],
      [overContainer]: [
        ...items[overContainer].slice(0, newIndex),
        items[activeContainer][activeIndex], // active.id
        ...items[overContainer].slice(newIndex),
      ],
    }

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
          >
            {activeId
              ? (
                <Item
                  value={activeId}
                  handle={true}
                  data-id={activeId}
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
