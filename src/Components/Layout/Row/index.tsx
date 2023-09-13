import styled from 'styled-components'

const Row = styled.section<{ column?: boolean }>`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
  flex-direction: ${(p) => (p.column ? 'column' : 'row')};
`
export default Row
