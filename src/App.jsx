import { Panel, PanelGroup } from 'react-resizable-panels'
import styled from 'styled-components'
import { Fragment } from 'react'
import { MeasuringStrategy } from '@dnd-kit/core'
import { defaultAnimateLayoutChanges } from '@dnd-kit/sortable'
import { FlexContainer } from '~/dnd-components'
import { ContentPanel, PickPanel, ResizeHandle } from '~/panel-components'

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const pickPanelProps = {
  adjustScale: true,
  Container: props => <FlexContainer {...props} />,
  wrapperStyle: () => ({
    width: 100,
    height: 100,
  }),
  animateLayoutChanges: args => defaultAnimateLayoutChanges({ ...args, wasDragging: true }),
  measuring: { droppable: { strategy: MeasuringStrategy.Always } },
  removable: true,
  handle: true,
}

function App() {
  return (
    <Fragment>
      <Container>
        <PanelGroup autoSaveId="example-v5" direction="horizontal">
          <Panel defaultSize={80} order={1}>
            <ContentPanel />
          </Panel>
          <ResizeHandle />

          <Panel order={2}>
            <PickPanel {...pickPanelProps} />
          </Panel>
        </PanelGroup>
      </Container>
    </Fragment>
  )
}

export default App
