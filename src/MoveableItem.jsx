import { useEffect, useRef, useState } from 'react'
import Moveable from 'react-moveable'

export const MovableItem = ({ children, ...rest }) => {
  const [target1, setTarget1] = useState()
  const [frame1, setFrame1] = useState({ translate: [0, 0] })
  const ref = useRef(null)

  useEffect(() => {
    ref.current && setTarget1(ref.current)
  }, [ref])

  const handleResize = (e) => {
    const beforeTranslate = e.drag.beforeTranslate

    setFrame1({ translate: beforeTranslate })
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`
    e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
  }

  return (
    <>
      <Item data-id="MovableItem" ref={ref} {...rest}>{children}</Item>
      <Moveable
        target={target1}
        // resizable
        draggable
        // keepRatio={false}
        throttleResize={1}
        // edge={false}
        // zoom={1}
        // origin
        // padding={{ left: 16, top: 16, right: 16, bottom: 16 }}
        renderDirections={['e']}
        // onResizeStart={(e) => {
        //   e.setOrigin(['%', '%'])
        //   e.dragStart && e.dragStart.set(frame1.translate)
        // }}
        // onResize={handleResize}
      />
    </>
  )
}
