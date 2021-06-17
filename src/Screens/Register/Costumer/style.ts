import styled from 'styled-components'

export const Container = styled.main``

export const Header = styled.section``
export const Body = styled.section`
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5px;
  &,
  > div {
    display: flex;
    gap: 10px;
  }

  > div {
    flex-wrap: wrap;
  }
`
