import { Colors } from '@blueprintjs/core'
import styled from 'styled-components'

export const Container = styled.main`
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    overflow: hidden;
    background-color: ${Colors.BLUE1};
    h1, p {
        color: white;
      }
    h1 {

      font-size: 3rem;
      font-weight: bold;
    }
`

export const Body = styled.section`
    border: 1px solid black;
`

export const Footer = styled.footer`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  /* color */
`
