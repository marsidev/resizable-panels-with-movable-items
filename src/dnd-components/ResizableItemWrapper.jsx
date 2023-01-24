import { forwardRef, useState } from 'react'
import { Resizable } from 're-resizable'
import { motion } from 'framer-motion'
// import useMeasure from 'react-use-measure'
import resizeStyles from './ResizeItemHandle.module.scss'

export const ResizableItemWrapper = forwardRef((props, forwardedRef) => {
  const { defaultSize, minHeight, minWidth, size, onResizeStop, enable, allowResizing, children, bounds, ...rest } = props
  const resizableProps = { defaultSize, minHeight, minWidth, size, onResizeStop, enable }

  const [isHovering, setIsHovering] = useState(false)
  // const [measureRef, { width, height }] = useMeasure()
  const { width, height } = bounds

  if (!allowResizing) {
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
          bottom: <div data-visible={isHovering} className={resizeStyles.BottomHandleResize} />,
          right: <div data-visible={isHovering} className={resizeStyles.RightHandleResize} />,
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
