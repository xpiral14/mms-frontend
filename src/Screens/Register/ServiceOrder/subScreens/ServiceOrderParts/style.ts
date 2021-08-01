import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
`
export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #0005;
`

export const Body = styled.div`
  position: relative;
`

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  /* align-items: center; */
  margin-bottom: 15px;
  padding-bottom: 5px;
  &:not(:last-child) {
    border-bottom: 1px solid #0005;
  }
  .bp3-form-group {
    margin: 0px !important;
  }
`

export const Footer = styled.div`
  position: relative;
  > div {
    position: fixed;
    box-shadow: 0 -10px 10px #0005;
    bottom: 0;
    position: fixed;
    width: 100%;
    background-color: white;
  }
`
