import styled from 'styled-components'

export const Container = styled.div`
  [class='bp3-table-quadrant bp3-table-quadrant-main'] {
    max-height: ${(p) => p.style?.maxHeight};
    height: ${(p) => p.style?.height};
    overflow-y: ${(p) => p.style?.overflowY};
  }
`

export const Body = styled.section``

export const Footer = styled.section`
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  ul {
    list-style-type: none !important;
    margin: 0;
  }
`
