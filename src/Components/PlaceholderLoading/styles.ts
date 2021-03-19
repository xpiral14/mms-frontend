import styled from 'styled-components'

export const Container = styled.div<{
  w: string
  h: string
  m?: string
  round?: string
}>`
  width: ${(p) => p.w};
  height: ${(p) => p.h};
  margin: ${(p) => p.m || 'none'};
  animation: pulse 1s infinite ease-in-out;
  border-radius: 7px;
  border-radius: ${(p) => (p.round ? p.round : 0)};
  @keyframes pulse {
    0% {
      background-color: rgb(165, 165, 165, 0.1);
    }
    50% {
      background-color: rgb(165, 165, 165, 0.3);
    }
    100% {
      background-color: rgb(165, 165, 165, 0.1);
    }
  }
`
