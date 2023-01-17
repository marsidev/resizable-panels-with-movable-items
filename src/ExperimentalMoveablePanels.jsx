import Moveable from 'react-moveable'
// import { useCallback, useEffect, useRef, useState } from 'react'
import * as React from 'react'
import styled from 'styled-components'

const Box = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const PanelsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  gap: 8px;
`

const Panel = ({ target, frame, boxRef, renderDirections, title, onResize, resizable, ...rest }) => {
  return (
    <>
      <Box data-id="box" ref={boxRef} {...rest}>{title}</Box>
      <Moveable
        target={target}
        resizable={resizable}
        // keepRatio={false}
        throttleResize={1.5}
        renderDirections={renderDirections}
        // edge={false}
        // zoom={1}
        // origin
        // padding={{ left: 16, top: 16, right: 16, bottom: 16 }}
        onResizeStart={resizable
          ? (e) => {
            e.setOrigin(['%', '%'])
            e.dragStart && e.dragStart.set(frame.translate)
          }
          : undefined}
        onResize={resizable && onResize ? onResize : undefined}
      />
    </>
  )
}

const Panels = () => {
  const [target1, setTarget1] = React.useState()
  const [target2, setTarget2] = React.useState()
  const [box2Width, setBox2Width] = React.useState('20%')
  const [frame1, setFrame1] = React.useState({ translate: [0, 0] })
  const [frame2, setFrame2] = React.useState({ translate: [0, 0] })
  const boxRef1 = React.useRef(null)
  const boxRef2 = React.useRef(null)
  const containerRef2 = React.useRef(null)

  React.useEffect(() => {
    boxRef1.current && setTarget1(boxRef1.current)
    boxRef2.current && setTarget2(boxRef2.current)
  }, [boxRef1, boxRef2])

  const onResizePanel1 = (e) => {
    const beforeTranslate = e.drag.beforeTranslate

    setFrame1({ translate: beforeTranslate })
    e.target.style.width = `${e.width}px`
    e.target.style.height = `${e.height}px`
    e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`

    const containerWidth = containerRef2.current.clientWidth
    const panel2Width = containerWidth - e.width - 8
    setBox2Width(`${panel2Width}px`)
    setFrame2({ translate: [beforeTranslate[0] + e.width + 8, beforeTranslate[1]] })
    console.log('onResizePanel1', { targetWidth: e.width, targetHeight: e.height, containerWidth, panel2Width })
  }

  // const onResizePanel2 = (e) => {
  //   const beforeTranslate = e.drag.beforeTranslate
  //   setFrame2({ translate: beforeTranslate })

  //   const containerWidth = containerRef2.current.clientWidth
  //   const panel1Width = boxRef1.current.clientWidth
  //   const panel2Width = containerWidth - panel1Width - 8

  //   console.log('onResizePanel2', { targetWidth: e.width, targetHeight: e.height, containerWidth, panel1Width, panel2Width })
  // }

  return (
    <PanelsContainer ref={containerRef2} data-id="PanelsContainer">
      <Panel
        resizable
        target={target1}
        frame={frame1}
        boxRef={boxRef1}
        style={{ width: '80%' }}
        renderDirections={['e']}
        title='Panel 1'
        onResize={onResizePanel1}
      />

      <Panel
        target={target2}
        frame={frame2}
        boxRef={boxRef2}
        style={{ width: box2Width }}
        renderDirections={[]}
        title='Panel 2'
      />
    </PanelsContainer>
  )
}

export default Panels
