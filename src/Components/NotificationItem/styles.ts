import styled from 'styled-components'
import { Colors } from '@blueprintjs/core'

export const Body = styled.div<{ readed?: boolean }>`
  position: relative;
  background-color: ${(p) => (!p.readed ? Colors.LIGHT_GRAY4 : Colors.WHITE)};
  cursor: pointer;
  :hover {
    background-color: ${(p) =>
    p.readed ? Colors.LIGHT_GRAY3 : Colors.LIGHT_GRAY5};
  }
  border-top: 1px solid #0001;
;
` 

export const Time = styled.div`
  position: absolute;
  right: 5px ;
  bottom:  5px;
  font-size: .7rem;
` 
