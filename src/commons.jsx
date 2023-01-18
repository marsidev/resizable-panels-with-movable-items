import styled from 'styled-components'

export const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`

export const GridList = styled.ul`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0em 0em 1em 0em;
  cursor: ${({ isDragged }) => isDragged ? 'grabbing' : 'inherit'};
`

export const Item = styled.li`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid gray;
  border-radius: 8px;
  color: gray;
  user-select: none;
  list-style-type: none;
  padding: 1.5em;
  /* cursor: ${({ isDragged }) => isDragged ? 'grabbing' : 'inherit'}; */
  /* background-color: ${({ isDragged, isSelected }) => isDragged || isSelected ? '#EEE' : '#FFF'}; */
  /* opacity: ${({ isDragged, isSelected }) => isDragged || isSelected ? 0.4 : 1}; */
`

export const HandleButton = styled.button`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  cursor: pointer;
  background: transparent;
  margin-right: 1em;
  cursor: ${({ isDragged }) => isDragged ? 'grabbing' : 'grab'};
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

export const HandleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#555"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="feather feather-move"
  >
    <polyline points="5 9 2 12 5 15" />
    <polyline points="9 5 12 2 15 5" />
    <polyline points="15 19 12 22 9 19" />
    <polyline points="19 9 22 12 19 15" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="12" y1="2" x2="12" y2="22" />
  </svg>
)
