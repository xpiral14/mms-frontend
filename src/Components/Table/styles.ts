import { Colors } from '@blueprintjs/core'
import styled from 'styled-components'

export const StyledTable = styled.table`
  th {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
    background: #fff;
  }
  tr.active td {
    background-color: ${Colors.BLUE2}!important;
    color: ${Colors.WHITE};
  }
  tr.active:hover {
    background-color: ${Colors.BLUE2}!important;
    color: ${Colors.WHITE};
  }
`
