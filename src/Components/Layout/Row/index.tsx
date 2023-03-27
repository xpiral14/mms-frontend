import styled from 'styled-components'

const Row = styled.section<{
  middle?: boolean,
  justifyBetween?: boolean
  padding?: number|string
}>`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
  padding: ${({ padding }) => padding ? typeof padding === 'string' ? padding : `${padding}px` : 0};
  ${(p) => (p.middle ? 'align-items: center;' : '')}
  ${(p) => (p.justifyBetween ? 'justify-content: space-between;' : '')}
`
export default Row
