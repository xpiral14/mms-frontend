import styled from 'styled-components'
import { Colors } from '@blueprintjs/core'

export const Body = styled.div<{readed?: boolean}>`
  background-color: ${p => p.readed ? Colors.LIGHT_GRAY4 : Colors.WHITE};
  cursor: pointer;
  :hover {
    background-color: ${p => p.readed ? Colors.LIGHT_GRAY3 : Colors.LIGHT_GRAY5};
  }
  border-top: 1px solid #0001 ;
` 
