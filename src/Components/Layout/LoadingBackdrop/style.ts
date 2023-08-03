import styled from 'styled-components'

export const Container = styled.div<{ loading?: boolean }>`
  display: ${p => p.loading ? 'flex' : 'none'};
  position: absolute;
  top:0;
  left:0;
  color: #ffffff20;
  backdrop-filter: blur(1.5px);
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`
