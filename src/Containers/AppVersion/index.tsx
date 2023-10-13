import React from 'react'
import { Container } from './styles'
const AppVersion = () => {
  return <Container>{import.meta.env.VITE_VERSION}</Container>
}

export default AppVersion
