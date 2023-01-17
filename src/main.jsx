import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import App from './App'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <StrictMode>
    <DndProvider backend={HTML5Backend}>
      <App />
    </DndProvider>
  </StrictMode>,
)
