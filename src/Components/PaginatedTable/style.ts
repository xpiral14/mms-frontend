import styled from 'styled-components'

export const Container = styled.main`
  width: 100%;
  height: 100vh;
  background-color: #212;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Body = styled.section`
  border: 1px solid black;
`

export const Footer = styled.section`
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  ul {
    list-style-type: none !important;
    margin: 0;
  }
`
