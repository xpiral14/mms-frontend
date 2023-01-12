import styled from 'styled-components'

export default styled.section<{expand: number}>`
  flex: ${({expand}) => 1 || expand};
`
