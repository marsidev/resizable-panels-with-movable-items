import { forwardRef } from 'react'
import styled from 'styled-components'

const Ul = styled.ul`
  display: grid;
  grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
  grid-gap: 8px;
  padding: 32px;
`

export const GridContainer = forwardRef(({ children, columns }, ref) => {
  return (
    <Ul
      ref={ref}
      columns={columns || 2}
      data-id='grid-container'
      data-columns={columns}
    >
      {children}
    </Ul>
  )
})
