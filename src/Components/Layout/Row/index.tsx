import styled from 'styled-components'

const Row = styled.section<{
  middle?: boolean,
  justifyBetween?: boolean
  padding?: number
}>`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
  padding: ${({padding}) => padding || 0 }px;
  ${(p) => (p.middle ? 'align-items: center;' : '')}
  ${(p) => (p.justifyBetween ? 'justify-content: space-between;' : '')}
`
export default Row
