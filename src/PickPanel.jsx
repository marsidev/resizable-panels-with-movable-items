import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useDrag, useDrop } from 'react-dnd'
import { useRef } from 'react'
import useStore from './store'
import { Container, Grid, Item } from './commons'

const DraggableItem = ({ id, children, ...rest }) => {
  const ref = useRef()
  const movePickableItems = useStore(s => s.movePickableItems)
  const addItemInPosition = useStore(s => s.addPickableItemInCertainPosition)

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'PickableItem',
      item: { id, type: 'PickableItem' },
      collect: monitor => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
      }),
    }),
    [id],
  )

  const [_, dropRef] = useDrop(
    () => ({
      accept: ['PickedItem', 'PickableItem'],
      drop: (item) => {
        const dragId = item.id
        const hoverId = id

        if (item.type === 'PickedItem') {
          console.log('[PickPanel]: adding new item into custom position', { dragId, hoverId, itemType: item.type })
          addItemInPosition(dragId, hoverId)
        }
        else {
          console.log('[PickPanel]: moving items', { dragId, hoverId, itemType: item.type })
          movePickableItems(dragId, hoverId)
        }
      },
      canDrop: item => item.id !== id,
      collect: monitor => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [id],
  )

  const dndRef = dragRef(dropRef(ref))

  return (
    <div ref={dndRef} style={{ opacity }}>
      <Item ref={dragRef}>
        {children}
      </Item>
    </div>
  )
}

export const PickPanel = () => {
  const items = useStore(s => s.pickableItems)
  const addPickableItem = useStore(s => s.addPickableItem)
  const [animRef] = useAutoAnimate()

  const [_, dropRef] = useDrop(
    () => ({
      accept: 'PickedItem',
      drop: (item) => {
        console.log('[PickPanel]: adding new item (if not exists already)', item)
        addPickableItem(item.id)
      },
      collect: monitor => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  )

  return (
    <Container ref={dropRef}>
      <Grid ref={animRef}>
        {items.map(item => (
          <DraggableItem key={item.id} id={item.id}>
            {item.name}
          </DraggableItem>
        ))}
      </Grid>
    </Container>
  )
}
