import { Colors } from '@blueprintjs/core'
import styled, { css } from 'styled-components'

export const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;

  [class='bp4-table-quadrant bp4-table-quadrant-main'] {
    overflow-y: ${(p) => p.style?.overflowY};
    width: ${(p) => p.style?.width};
  }
`

export const Body = styled.div<{ height?: string }>`
  flex: 1;
  height: ${(p) =>
    css`
      ${p.height || 'inherit'}
    `};
  ${(p) =>
    p.height &&
    css`
      overflow-y: scroll;
    `}
  tr.active td {
    background-color: ${Colors.BLUE2}!important;
    color: ${Colors.WHITE};
  }
  tr.active:hover {
    background-color: ${Colors.BLUE2}!important;
    color: ${Colors.WHITE};
  }
`

export const Footer = styled.div`
  margin-top: 5px;
  ul {
    list-style-type: none !important;
    margin: 0;
  }
  .bp4-form-group {
    margin: 0;
  }
`

export const PaginateContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;

  > ul {
    padding: 0 !important;
  }
`
