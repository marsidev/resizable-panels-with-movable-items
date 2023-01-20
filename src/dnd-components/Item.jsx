import { forwardRef, useState } from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import { Resizable } from 're-resizable'
import styles from './Item.module.scss'
import { SouthEastResizeIcon } from './SouthEastResizeIcon'
import { Handle, Remove } from '~/dnd-components'

const defaultTileSize = 100
const defaultGridGap = 8

const initialMotionAnimate = {
  x: 0,
  y: 0,
  scale: 1,
  opacity: 1,
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
    }
    : initialMotionAnimate
}

const ResizableWrapper = forwardRef((props, ref) => {
  const { children, allowResizing, className, style, 'data-id': dataId, ...resizableProps } = props
  const commonProps = { className, style, 'data-id': dataId }

  const [isHovering, setIsHovering] = useState(false)

  if (!allowResizing) {
    return (
      <div ref={ref} {...commonProps}>
        {children}
      </div>
    )
  }

  return (
    <Resizable
      {...commonProps}
      {...resizableProps}
      handleComponent={{
        bottomRight: isHovering ? <SouthEastResizeIcon /> : null,
      }}
    >
      <div
        data-id="item-with-ref"
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {children}
      </div>
    </Resizable>
  )
})

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
  const [width, setWidth] = useState(item.style.width)
  const [height, setHeight] = useState(item.style.height)

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

  const onResize = (e, direction, ref, d) => {
    const newWidth = width + d.width
    const newHeight = height + d.height
    console.log('resizing', { width, height, item, direction, d, newWidth, newHeight })
    setWidth(width + d.width)
    setHeight(height + d.height)
  }

  return (
    <ResizableWrapper
      as='li'
      className={classNames(
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
      onResizeStop={onResize}
      enable={{ bottomRight: true }}
      allowResizing={containerId === 'main'}
    >
      <motion.div
        className={classNames(
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
        {...(!handle ? listeners : undefined)}
        {...props}
        tabIndex={!handle ? 0 : undefined}
      >
        {item.value}

        {onRemove && <Remove className={styles.Remove} onClick={onRemove} />}
        {handle && <Handle isDragging={dragOverlay || dragging} {...handleProps} {...listeners} />}
      </motion.div>
    </ResizableWrapper>
  )
})
