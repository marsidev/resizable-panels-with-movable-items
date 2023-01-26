import { DotsSixVertical } from 'phosphor-react'
import { forwardRef } from 'react'
import { Action } from './Action'

export const Handle = forwardRef(
  ({ isDragging, ...props }, ref) => {
    return (
      <Action
        ref={ref}
        cursor={isDragging ? 'grabbing' : 'grab'}
        style={{
          left: '0.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: isDragging ? 0.4 : 1,
        }}
        {...props}
      >
        <DotsSixVertical size={16} weight="bold" color="#6f7b88" />
      </Action>
    )
  },
)
