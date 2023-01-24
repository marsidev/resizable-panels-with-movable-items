import { forwardRef, useState } from 'react'
import { Resizable } from 're-resizable'
import { motion } from 'framer-motion'
import resizeStyles from './ResizeItemHandle.module.scss'

export const ResizableItemWrapper = forwardRef((props, forwardedRef) => {
  const { defaultSize, minHeight, minWidth, size, onResizeStop, enable, children, bounds, item, ...rest } = props
  const resizableProps = { defaultSize, minHeight, minWidth, size, onResizeStop, enable }

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
          bottom: <span onDoubleClick={() => console.log('adjust bottom!', item)} data-visible={isHovering} className={resizeStyles.BottomHandleResize} />,
          right: <span onDoubleClick={() => console.log('adjust right!', item)} data-visible={isHovering} className={resizeStyles.RightHandleResize} />,
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
