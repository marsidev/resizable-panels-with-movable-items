import { forwardRef } from 'react'
import type {
  ImperativePanelHandle,
  PanelGroupProps,
  PanelProps as PanelSourceProps,
} from 'react-resizable-panels'
import {
  PanelGroup as PanelGroupSource,
  Panel as PanelSource,
} from 'react-resizable-panels'

interface PanelProps extends PanelSourceProps {
  internalRef: React.Ref<ImperativePanelHandle>
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>((props, ref) => {
  const { children, className, collapsible, defaultSize, id, maxSize, minSize, onCollapse, onResize, order, style, tagName, internalRef, ...rest } = props

  const panelProps = { className, collapsible, defaultSize, id, maxSize, minSize, onCollapse, onResize, order, style, tagName }

  return (
    <PanelSource ref={internalRef} {...panelProps}>
      <div ref={ref} {...rest}>
        {children}
      </div>
    </PanelSource>
  )
})

export const PanelGroup = forwardRef<HTMLDivElement, PanelGroupProps>((props, ref) => {
  const { children, className, direction, id, autoSaveId, onLayout, tagName, style, ...rest } = props

  const panelGroupSourceProps = { className, direction, id, autoSaveId, onLayout, tagName, style }

  return (
    <div ref={ref} style={style} {...rest}>
      <PanelGroupSource {...panelGroupSourceProps}>
        {children}
      </PanelGroupSource>
    </div>
  )
})
