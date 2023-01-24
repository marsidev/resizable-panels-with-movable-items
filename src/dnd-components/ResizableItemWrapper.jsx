import { forwardRef, useState } from 'react'
import { Resizable } from 're-resizable'
import { motion } from 'framer-motion'
import resizeStyles from './ResizeItemHandle.module.scss'
import { useStore } from '~/store'

export const ResizableItemWrapper = forwardRef((props, forwardedRef) => {
  const { defaultSize, minHeight, minWidth, size, onResizeStop, onResizeStart, enable, children, bounds, item, ...rest } = props
  const resizableProps = { defaultSize, minHeight, minWidth, size, onResizeStop, onResizeStart, enable }

  const [adjustItemWidth, adjustItemHeight] = useStore(s => [s.adjustItemWidth, s.adjustItemHeight])
  const [isHovering, setIsHovering] = useState(false)
  const { width, height } = bounds
  const { autoAdjust, resizable } = item

  if (!resizable) {
    return (
      <div ref={forwardedRef} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.li
      animate={{ width, height }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      ref={forwardedRef}
      {...rest}
    >
      <Resizable
        handleComponent={{
          bottomRight: <div data-visible={isHovering} className={resizeStyles.BottomRightHandleResize} />,
          bottom: <span
            onDoubleClick={autoAdjust ? () => adjustItemHeight(item.id) : undefined}
            data-visible={isHovering}
            className={resizeStyles.BottomHandleResize}
          />,
          right: <span
            onDoubleClick={autoAdjust ? e => adjustItemWidth(item.id) : undefined}
            data-visible={isHovering}
            className={resizeStyles.RightHandleResize}
          />,
        }}
        handleClasses={{
          bottom: resizeStyles.BottomHandleResizeWrapper,
          right: resizeStyles.RightHandleResizeWrapper,
          bottomRight: resizeStyles.BottomRightHandleResizeWrapper,
        }}
        {...resizableProps}
      >
        {children}
      </Resizable>
    </motion.li>
  )
})
