import { forwardRef, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import cn from 'classnames'
import useMeasure from 'react-use-measure'
import styles from './Item.module.scss'
import { AutoAdjust, Handle as DragHandle, Remove, ResizableItemWrapper } from '~/components'
import { useStore } from '~/store'
import { defaultGridGap, minTileSize } from '~/constants'

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
  handleProps,
  index,
  listeners,
  sorting,
  // style,
  // transition,
  transform,
  itemId,
  wrapperStyle,
  containerId,
  ...props
}, forwardedRef) => {
  const [getItem, setItemSize, removeItem, adjustItemSize] = useStore(s => [s.getItem, s.setItemSize, s.removeItem, s.adjustItemSize])
  const [measureRef, bounds] = useMeasure()
  const [isResizing, setIsResizing] = useState(false)
  const item = getItem(itemId, containerId)

  const { width, height } = item?.style ?? {}

  const gridCols = useMemo(() => Math.ceil(width / (minTileSize + defaultGridGap)), [width])
  const gridRows = useMemo(() => Math.ceil(height / (minTileSize + defaultGridGap)), [height])

  if (!item) return null

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

  const onRemove = containerId === 'main' ? () => removeItem(item.id) : undefined

  const onAutoAdjust = () => adjustItemSize(item.id)

  const onResizeStop = (e, direction, ref, d) => {
    if (d.width !== 0 || d.height !== 0) {
      const newWidth = width + d.width
      const newHeight = height + d.height
      console.log('onResizeStop', { width, height, item, direction, d, newWidth, newHeight })

      setItemSize(item.id, {
        width: newWidth,
        height: newHeight,
      })
    }
    setIsResizing(false)
  }

  // useEffect(() => {
  //   if (item.value === 32 && containerId === 'main') {
  //     console.log({ dragging, transform, width, height, gridCols, gridRows, liStyle })
  //   }
  // }, [dragging, transform, width, height, gridCols, gridRows, liStyle])

  return (
    <ResizableItemWrapper
      data-resize-count={item.resizeCount}
      className={cn(
        styles.Wrapper,
        sorting && styles.sorting,
        dragOverlay && styles.dragOverlay,
      )}
      style={liStyle}
      ref={forwardedRef}
      defaultSize={{
        width: minTileSize,
        height: minTileSize,
      }}
      minHeight={minTileSize}
      minWidth={minTileSize}
      size={{ width, height }}
      data-id="resizable-item-wrapper"
      onResizeStop={onResizeStop}
      onResizeStart={() => setIsResizing(true)}
      enable={{ bottomRight: true, bottom: true, right: true }}
      bounds={bounds}
      item={item}
    >
      <motion.div
        ref={measureRef}
        key={`${item.id}_v${item.resizeCount}`}
        data-id={`${item.id}_v${item.resizeCount}`}
        className={cn(
          styles.Item,
          dragging && styles.dragging,
          item.movable && styles.withHandle,
          dragOverlay && styles.dragOverlay,
          disabled && styles.disabled,
          color && styles.color,
        )}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
        layoutId={item.id}
        animate={getMotionAnimate(transform, dragging)}
        transition={getMotionTransition(dragging)}
        exit={{
          opacity: 0,
          scale: 0,
          transition: {
            duration: 0.25,
          },
        }}
        data-value={item.value}
        data-index={index}
        data-resize-count={item.resizeCount}
        data-width={width}
        data-height={height}
        {...(!item.movable ? listeners : undefined)}
        {...props}
        tabIndex={!item.movable ? 0 : undefined}
      >
        <span>{item.value}</span>

        <span style={{ fontSize: 12 }}>
          {isResizing
            ? `${Math.round(bounds.width)}x${Math.round(bounds.height)}`
            : `${width}x${height}`}
        </span>

        {item.removable && <Remove className={styles.Remove} onClick={onRemove} />}

        {item.autoAdjust && <AutoAdjust className={styles.AutoAdjust} onClick={onAutoAdjust} />}

        {item.movable && (
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
