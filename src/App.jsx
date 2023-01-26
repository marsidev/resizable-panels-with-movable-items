import styled from 'styled-components'
import { DndContext, KeyboardSensor, MeasuringStrategy, MouseSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core'
import { defaultAnimateLayoutChanges, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'
import useMeasure from 'react-use-measure'
import { DnDPanel, Panel, PanelGroup, ResizeHandle } from '~/components'
import { useStore } from '~/store'
import { defaultGridGap, minTileSize, tilesContainerPadding } from '~/constants'

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
  animateLayoutChanges: args => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
}

const toolbarPanelProps = {
  containerId: 'toolbar',
  animateLayoutChanges: args => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
}

// const dropAnimationConfig = {
//   sideEffects: defaultDropAnimationSideEffects({
//     styles: {
//       active: {
//         opacity: '0.5',
//       },
//     },
//   }),
// }

function App() {
  const [items, activeItem] = useStore(s => [s.items, s.activeItem])
  const [showGridLines, toggleShowGridLines] = useStore(s => [s.showGridLines, s.toggleShowGridLines])
  const [setItems, setActiveItem, moveItems] = useStore(s => [s.setItems, s.setActiveItem, s.moveItems])
  const { toolbar: toolbarItems, main: mainItems } = items

  const [panel1Cols, setPanel1Cols] = useState()
  const [panel2Cols, setPanel2Cols] = useState()

  const [resizerRef, resizerBounds] = useMeasure()
  const [containerRef, containerBounds] = useMeasure()
  // const p1Ref = useRef()
  // const p2Ref = useRef()

  const [p1Ref, p1Bounds] = useMeasure()
  const [p2Ref, p2Bounds] = useMeasure()

  // measure all in an useEffect using useMeasure hook and ref
  useEffect(() => {
    if (containerBounds.width === 0 || resizerBounds.width === 0 || p1Bounds.width === 0 || p2Bounds.width === 0) return

    const p1Width = p1Bounds.width
    const p2Width = p2Bounds.width
    // const p1Width = p1Ref.current.scrollWidth
    // const p2Width = p2Ref.current.scrollWidth

    const p1Cols = Math.floor((p1Width - tilesContainerPadding) / (minTileSize + defaultGridGap))
    const p2Cols = Math.floor((p2Width - tilesContainerPadding) / (minTileSize + defaultGridGap))

    const p1Height = p1Bounds.height
    const p2Height = p2Bounds.height
    // const p1Height = p1Ref.current.scrollHeight
    // const p2Height = p2Ref.current.scrollHeight

    const p1Rows = Math.floor((p1Height - tilesContainerPadding) / (minTileSize + defaultGridGap))
    const p2Rows = Math.floor((p2Height - tilesContainerPadding) / (minTileSize + defaultGridGap))

    console.log({
      p1Width,
      p1Height,
      p1Cols,
      p1Rows,
      p2Width,
      p2Height,
      p2Cols,
      p2Rows,
      // containerWidth,
      // resizerWidth,
      // 'p1 + resizer + p2': p1Width + resizerWidth + p2Width,
      // p1Bounds,
      // p2Bounds,
    })

    if (p1Cols > 0) setPanel1Cols(p1Cols)
    if (p2Cols > 0) setPanel2Cols(p2Cols)
  }, [p1Bounds, containerBounds])

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
    if (!active || !over) return
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
      moveItems(activeIndex, overIndex, activeContainer)
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

    setItems(newItems)
  }

  return (
    <Container data-id="container" ref={containerRef}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
      >
        <div>
          <input
            type="checkbox"
            id="show-grids"
            name="show-grids"
            checked={showGridLines}
            onChange={toggleShowGridLines}
          />
          Ver grillas
        </div>

        <PanelGroup data-id="panel-group" autoSaveId="example-v6" direction="horizontal">
          <Panel ref={p1Ref} data-id="main-panel" defaultSize={80} order={1}>
            <DnDPanel columns={panel1Cols} {...mainPanelProps} items={mainItems} />
          </Panel>

          <ResizeHandle ref={resizerRef} />

          <Panel ref={p2Ref} data-id="toolbar-panel" minSize={10} order={2}>
            <DnDPanel columns={panel2Cols} {...toolbarPanelProps} items={toolbarItems} />
          </Panel>
        </PanelGroup>

        {/* {createPortal(
          <DragOverlay
            adjustScale={true}
            dropAnimation={dropAnimationConfig}
            // modifiers={[restrictToWindowEdges]}
          >
            {activeItem
              ? (
                <Item
                  item={activeItem}
                  handle={true}
                  wrapperStyle={{
                    // width: activeItem.style.width,
                    // height: activeItem.style.height,
                  }}
                  dragOverlay
                />
              )
              : null}
          </DragOverlay>,
          document.body,
        )} */}

        {/* <DragOverlay
          adjustScale={true}
          dropAnimation={dropAnimationConfig}
        >
          {activeItem
            ? (
              <Item
                item={activeItem}
                handle={true}
                wrapperStyle={{}}
                dragOverlay
              />
            )
            : null}
        </DragOverlay> */}
      </DndContext>
    </Container>
  )
}

export default App
