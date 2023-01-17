import { useDrag, useDrop } from 'react-dnd'
import { useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import useStore from './store'
import { Container, Grid, Item } from './commons'

const DraggableItem = ({ id, children, ...rest }) => {
  const ref = useRef()
  const movePickedItems = useStore(s => s.movePickedItems)
  const addItemInPosition = useStore(s => s.addPickedItemInCertainPosition)

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'PickedItem',
      item: { id, type: 'PickedItem' },
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

        if (item.type === 'PickableItem') {
          console.log('[ContentPanel]: adding new item into custom position', { dragId, hoverId, itemType: item.type })
          addItemInPosition(dragId, hoverId)
        }
        else {
          console.log('[ContentPanel]: moving items', { dragId, hoverId, itemType: item.type })
          movePickedItems(dragId, hoverId)
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

export const ContentPanel = () => {
  const items = useStore(s => s.pickedItems)
  const addPickedItem = useStore(s => s.addPickedItem)
  const [animRef] = useAutoAnimate()

  const [_, dropRef] = useDrop(
    () => ({
      accept: 'PickableItem',
      drop: (item) => {
        console.log('[ContentPanel]: adding new item (if not exists already)', item)
        addPickedItem(item.id)
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
