import styled from 'styled-components'

export const Container = styled.div<{ maxWidth?: string | number }>`
  display: flex;
  align-items: center;
  gap: 5px;
  .bp4-multi-select {
    width: ${(p) => p.maxWidth || '100%'};
    height: 30px;
    overflow-y: scroll;

    ::-webkit-scrollbar {
      width: 0px;
      height: 0px;
    }
    ::-webkit-scrollbar-thumb {
      background: #b3afb3;
      border-radius: 0px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #b3afb3;
    }
    ::-webkit-scrollbar-track {
      background: #f0f0f0;
      border-radius: 0px;
      box-shadow: inset 0px 0px 0px 0px #f0f0f0;
    }
  }
`
