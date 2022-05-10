import React from 'react'
import { Container } from './styles'
const AppVersion = () => {
  return <Container>{process.env.REACT_APP_VERSION}</Container>
}

export default AppVersion
