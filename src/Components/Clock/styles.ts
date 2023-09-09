import { Colors } from '@blueprintjs/core'
import styled, { keyframes } from 'styled-components'

const blinkAnimation = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`
export const ClockContainer = styled.div`
  p {
    margin: 0;
    padding: 0;
    color: ${Colors.GRAY4};
    font-weight: bold;
  }
  .blink {
    transition: opacity 1s ease;
    animation:  ${blinkAnimation} 1s linear infinite;
  }
`
export const TimerContent = styled.p`
  font-size: 5rem;
`

export const DayContent = styled.p`
  font-size: 1rem;
  width: 100%;
  text-align: center;
`
