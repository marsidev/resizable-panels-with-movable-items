import { X } from 'phosphor-react'
import { Action } from './Action'

export function Remove(props) {
  return (
    <Action
      {...props}
      active={{
        fill: 'rgba(255, 70, 70, 0.95)',
        background: 'rgba(255, 70, 70, 0.1)',
      }}
      style={{
        top: '0.5rem',
        right: '0.5rem',
      }}
    >
      <X size={16} weight="bold" color="#6f7b88" />
    </Action>
  )
}
