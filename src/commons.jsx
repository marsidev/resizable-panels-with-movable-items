import styled from 'styled-components'

export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`

export const Item = styled.div`
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
  border-radius: 8px;
  color: gray;
  user-select: none;
`

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  max-height: calc(100vh);
  background-color: var(--color-panel-background);
  justify-content: center;
  padding: 16px;
  height: 100%;
  border-radius: 0.5rem;
  overflow-y: auto;
`
