import { forwardRef, useState } from 'react'
import resizeStyles from './ResizeItemHandle.module.scss'

export const ResizableItemWrapper = forwardRef((props, ref) => {
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
        bottomRight: <div data-visible={isHovering} className={resizeStyles.BottomRightHandleResize} />,
        bottom: <div data-visible={isHovering} className={resizeStyles.BottomHandleResize} />,
        right: <div data-visible={isHovering} className={resizeStyles.RightHandleResize} />,
      }}
      handleClasses={{
        bottom: resizeStyles.BottomHandleResizeWrapper,
        right: resizeStyles.RightHandleResizeWrapper,
        bottomRight: resizeStyles.BottomRightHandleResizeWrapper,
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
