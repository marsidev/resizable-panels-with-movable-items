import { useRef } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Container, Grid, Item } from '~/commons'
import { useStore } from '~/store'

const DraggableItem = ({ id, children, ...rest }) => {
  const ref = useRef()
  const movePickedItems = useStore(s => s.movePickedItems)
  const addItemInPosition = useStore(s => s.addPickedItemInCertainPosition)

  return (
    <div>
      <Item>
        {children}
      </Item>
    </div>
  )
}

export const ContentPanel = () => {
  const { main: items } = useStore(s => s.items)
  const addMainItem = useStore(s => s.addMainItem)
  const [animRef] = useAutoAnimate()

  return (
    <Container>
      <Grid ref={animRef}>
        {items.map(id => (
          <DraggableItem key={id} id={id}>
            {id}
          </DraggableItem>
        ))}
      </Grid>
    </Container>
  )
}
