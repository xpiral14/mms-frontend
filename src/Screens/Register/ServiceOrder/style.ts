import styled from 'styled-components'

export const Container = styled.main`
  height: 100%;
`

export const Header = styled.section``
export const Body = styled.section`
  height: calc(100% - 50px);
  flex-direction: column;
  margin-top: 5px;
  &,
  > div:first-child {
    display: flex;
    gap: 10px;
  }

  > div {
    flex-wrap: wrap;
  }
`
export const SelectDiv = styled.div`
  width: 160px;
`
