import { Container } from './styles'

export default function Strip({children, variation}: any) {
  return (
    <Container variation={variation}>
      {children}
    </Container>
  )
}
