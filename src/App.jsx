import { Panel, PanelGroup } from 'react-resizable-panels'
import styled from 'styled-components'
import ResizeHandle from './ResizeHandle'
import { PickPanel } from './PickPanel'
import { ContentPanel } from './ContentPanel'

const Container = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

function App() {
  return (
    <Container>
      <PanelGroup autoSaveId="example-v5" direction="horizontal">
        <Panel defaultSize={80} order={1}>
          <ContentPanel />
        </Panel>
        <ResizeHandle />

        <Panel order={2}>
          <PickPanel />
        </Panel>
      </PanelGroup>
    </Container>
  )
}

export default App
