import styled, { css } from 'styled-components'

export const Container = styled.div<{
  width?: string
  labelPosition?: 'vertical' | 'horizontal'
}>`
  display: flex;
  align-items: ${(p) =>
    p.labelPosition === 'horizontal' ? 'center' : 'inital'};
  flex-direction: ${(p) =>
    p.labelPosition === 'horizontal' ? 'row' : 'column'};
  gap: 5px;
  width: ${p => p.width};
  margin-bottom: 15px;
  ${(p) =>
    p.width &&
    css`
      .bp3-input {
        width: ${p.width} !important;
      }
    `}
`
