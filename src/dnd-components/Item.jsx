import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'
import styles from './Item.module.scss'
import { Handle as DragHandle, Remove, ResizableItemWrapper } from '~/dnd-components'
import { useStore } from '~/store'

const defaultTileSize = 100
const defaultGridGap = 8

const initialMotionAnimate = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}

const getMotionTransition = dragging => ({
  duration: !dragging ? 0.25 : 0,
  easings: {
    type: 'spring',
  },
  scale: {
    duration: 0.25,
  },
  zIndex: {
    delay: dragging ? 0 : 0.25,
  },
})

const getMotionAnimate = (transform, dragging) => {
  return transform
    ? {
      x: Math.round(transform.x),
      y: Math.round(transform.y),
      // scale: dragging ? 1.05 : 1,
      zIndex: dragging ? 1 : 0,
      // boxShadow: dragging
      //   ? '0 0 0 1px rgba(63, 63, 68, 0.05), 0px 15px 15px 0 rgba(34, 33, 81, 0.25)'
      //   : undefined,
      opacity: dragging ? 0.5 : 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }
    : initialMotionAnimate
}

export const Item = forwardRef(({
  color,
  dragOverlay,
  dragging,
  disabled,
  fadeIn,
  handle,
  handleProps,
  index,
  listeners,
  onRemove,
  sorting,
  style,
  transition,
  transform,
  item,
  wrapperStyle,
  containerId,
  ...props
}, ref) => {
  const incrementResizeCount = useStore(s => s.incrementMainItemResizeCount)

  const [width, setWidth] = useState(item.style.width)
  const [height, setHeight] = useState(item.style.height)
  // const [isResizing, setIsResizing] = useState(false)

  const gridCols = Math.ceil(width / (defaultTileSize + defaultGridGap))
  const gridRows = Math.ceil(height / (defaultTileSize + defaultGridGap))

  const liStyle = {
    ...wrapperStyle,
    ...item.style,
    // 'transition': [transition, wrapperStyle?.transition]
    //   .filter(Boolean)
    //   .join(', '),
    // // 'transform': CSS.Translate.toString(transform),
    // '--translate-x': transform
    //   ? `${Math.round(transform.x)}px`
    //   : undefined,
    // '--translate-y': transform
    //   ? `${Math.round(transform.y)}px`
    //   : undefined,
    // '--scale-x': transform?.scaleX
    //   ? `${transform.scaleX}`
    //   : undefined,
    // '--scale-y': transform?.scaleY
    //   ? `${transform.scaleY}`
    //   : undefined,
    '--index': index,
    '--color': color,
    opacity: 1,
    gridRowStart: `span ${gridRows}`,
    gridColumnStart: `span ${gridCols}`,
  }

  const onResizeStop = (e, direction, ref, d) => {
    if (d.width !== 0 || d.height !== 0) {
      const newWidth = width + d.width
      const newHeight = height + d.height
      console.log('onResizeStop', { width, height, item, direction, d, newWidth, newHeight })

      setWidth(width + d.width)
      setHeight(height + d.height)
      incrementResizeCount(item.id)
    }

    // setIsResizing(false)
  }

  return (
    <ResizableItemWrapper
      as='li'
      data-resize-count={item.resizeCount}
      className={cn(
        styles.Wrapper,
        fadeIn && styles.fadeIn,
        sorting && styles.sorting,
        dragOverlay && styles.dragOverlay,
      )}
      style={liStyle}
      ref={ref}
      defaultSize={{
        width: defaultTileSize,
        height: defaultTileSize,
      }}
      minHeight={defaultTileSize}
      minWidth={defaultTileSize}
      size={{ width, height }}
      data-id="resizable-item-wrapper"
      onResizeStop={onResizeStop}
      // onResizeStart={() => setIsResizing(true)}
      enable={{ bottomRight: true, bottom: true, right: true }}
      allowResizing={containerId === 'main'}
    >
      <motion.div
        key={`${item.id}_v${item.resizeCount}`}
        className={cn(
          styles.Item,
          dragging && styles.dragging,
          handle && styles.withHandle,
          dragOverlay && styles.dragOverlay,
          disabled && styles.disabled,
          color && styles.color,
        )}
        style={style}
        layoutId={item.id}
        animate={getMotionAnimate(transform, dragging)}
        transition={getMotionTransition(dragging)}
        data-id={item.id}
        data-value={item.value}
        data-index={index}
        data-resize-count={item.resizeCount}
        {...(!handle ? listeners : undefined)}
        {...props}
        tabIndex={!handle ? 0 : undefined}
      >
        <span>{item.value}</span>
        <span style={{ fontSize: 12 }}>{Math.round(width)}x{Math.round(height)}</span>

        {onRemove && <Remove className={styles.Remove} onClick={onRemove} />}

        {handle && (
          <DragHandle
            className={styles.DragHandle}
            isDragging={dragOverlay || dragging}
            {...handleProps}
            {...listeners}
          />
        )}
      </motion.div>
    </ResizableItemWrapper>
  )
})
