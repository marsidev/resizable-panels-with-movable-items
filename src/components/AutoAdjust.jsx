import { CornersOut } from 'phosphor-react'
import { Action } from './Action'

export function AutoAdjust(props) {
  return (
    <Action
      {...props}
      style={{
        top: '0.5rem',
        right: '2.5rem',
      }}
    >
      <CornersOut size={16} weight="bold" color="#6f7b88" />
    </Action>
  )
}
