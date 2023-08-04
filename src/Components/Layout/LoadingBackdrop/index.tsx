import { Container } from './style'
import { Spinner } from '@blueprintjs/core'

const LoadingBackdrop = ({ loading }: { loading?: boolean }) => {
  return (
    <Container loading={loading}>
      <Spinner />
    </Container>
  )
}

export default LoadingBackdrop
