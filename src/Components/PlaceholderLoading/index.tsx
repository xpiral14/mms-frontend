import React from 'react'
import { Container } from './styles'

interface PlaceholderLoadingProps {
  width: string
  height: string
  margin?: string
  round?: string
}
const PlaceholderLoading: React.FC<PlaceholderLoadingProps> = ({
  width,
  height,
  margin,
  round,
  children,
}) => {
  return (
    <Container
      w={width || '100%'}
      h={height || '15px'}
      m={margin}
      round={round}
    >
      {children}
    </Container>
  )
}

export default PlaceholderLoading
