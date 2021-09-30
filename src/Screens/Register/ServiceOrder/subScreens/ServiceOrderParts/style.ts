import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
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
  flex: 1;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
`
