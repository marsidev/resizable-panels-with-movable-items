import { forwardRef, memo } from 'react'
import classNames from 'classnames'
import styles from './Item.module.scss'
import { Handle, Remove } from '~/dnd-components'

export const Item = memo(forwardRef(({
  color,
  dragOverlay,
  dragging,
  disabled,
  fadeIn,
  handle,
  handleProps,
  height,
  index,
  listeners,
  onRemove,
  renderItem,
  sorting,
  style,
  transition,
  transform,
  value,
  wrapperStyle,
  ...props
}, ref) => {
  return (
    <li
      className={classNames(
        styles.Wrapper,
        fadeIn && styles.fadeIn,
        sorting && styles.sorting,
        dragOverlay && styles.dragOverlay,
      )}
      style={
        {
          ...wrapperStyle,
          'transition': [transition, wrapperStyle?.transition]
            .filter(Boolean)
            .join(', '),
          '--translate-x': transform
            ? `${Math.round(transform.x)}px`
            : undefined,
          '--translate-y': transform
            ? `${Math.round(transform.y)}px`
            : undefined,
          '--scale-x': transform?.scaleX
            ? `${transform.scaleX}`
            : undefined,
          '--scale-y': transform?.scaleY
            ? `${transform.scaleY}`
            : undefined,
          '--index': index,
          '--color': color,
        }
      }
      ref={ref}
    >
      <div
        className={classNames(
          styles.Item,
          dragging && styles.dragging,
          handle && styles.withHandle,
          dragOverlay && styles.dragOverlay,
          disabled && styles.disabled,
          color && styles.color,
        )}
        style={style}
        {...(!handle ? listeners : undefined)}
        {...props}
        tabIndex={!handle ? 0 : undefined}
      >
        {value}

        {onRemove && <Remove className={styles.Remove} onClick={onRemove} />}
        {handle && <Handle isDragging={dragOverlay || dragging} {...handleProps} {...listeners} />}
      </div>
    </li>
  )
}))
