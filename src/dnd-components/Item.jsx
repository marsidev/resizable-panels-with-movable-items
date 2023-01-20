import { forwardRef, useState } from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
// import { CSS } from '@dnd-kit/utilities'
import { Resizable } from 're-resizable'
import styles from './Item.module.scss'
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

const ResizableLi = forwardRef((props, ref) => {
  const { onResize, style, className, children, width, height, ...rest } = props

  const columns = Math.ceil(width / (defaultTileSize + defaultGridGap))
  const gridRowStart = `span ${columns}`
  const gridColumnStart = `span ${columns}`

  return (
    <Resizable
      as='li'
      className={className}
      defaultSize={{
        width: defaultTileSize,
        height: defaultTileSize,
      }}
      minHeight={defaultTileSize}
      minWidth={defaultTileSize}
      size={{ width, height }}
      data-id="resizable-item-wrapper"
      style={{
        ...style,
        gridRowStart,
        gridColumnStart,
      }}
      onResizeStop={onResize}
      enable={{ top: false, right: false, bottom: false, left: false, topRight: false, bottomRight: true, bottomLeft: false, topLeft: false }}
    >
      <div
        data-id="item-with-ref"
        ref={ref}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
        {...rest}
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
  ...props
}, ref) => {
  const [width, setWidth] = useState(item.style.width)
  const [height, setHeight] = useState(item.style.height)

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
    'opacity': 1,
  }

  // useEffect(() => {
  //   if ((dragging || sorting) && (item.value === 17 || item.value === 32)) {
  //     console.log('item dragging|sorting', { liStyle, item, wrapperStyle, sorting, dragging, transform })
  //   }
  // }, [dragging, sorting, liStyle, item])

  const onResize = (e, direction, ref, d) => {
    const newWidth = width + d.width
    const newHeight = height + d.height
    console.log('resizing', { width, height, item, direction, d, newWidth, newHeight })
    setWidth(width + d.width)
    setHeight(height + d.height)
  }

  return (
    <ResizableLi
      // as="li"
      className={classNames(
        styles.Wrapper,
        fadeIn && styles.fadeIn,
        sorting && styles.sorting,
        dragOverlay && styles.dragOverlay,
      )}
      style={liStyle}
      ref={ref}
      onResize={onResize}
      width={width}
      height={height}
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
    </ResizableLi>
  )
})
