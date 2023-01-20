import { forwardRef } from 'react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
// import { CSS } from '@dnd-kit/utilities'
import styles from './Item.module.scss'
import { Handle, Remove } from '~/dnd-components'

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

export const Item = forwardRef(({
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
  sorting,
  style,
  transition,
  transform,
  item,
  wrapperStyle,
  ...props
}, ref) => {
  const liStyle = {
    ...wrapperStyle,
    ...item.style,
    'transition': [transition, wrapperStyle?.transition]
      .filter(Boolean)
      .join(', '),
    // 'transform': CSS.Translate.toString(transform),
    '--translate-x': transform
      ? `${Math.round(transform.x)}px`
      : undefined,
    '--translate-y': transform
      ? `${Math.round(transform.y)}px`
      : undefined,
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

  return (
    <li
      className={classNames(
        styles.Wrapper,
        fadeIn && styles.fadeIn,
        sorting && styles.sorting,
        dragOverlay && styles.dragOverlay,
      )}
      style={liStyle}
      ref={ref}
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
        // layoutId={item.id}
        // animate={getMotionAnimate(transform, dragging)}
        // transition={getMotionTransition(dragging)}
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
    </li>
  )
})
