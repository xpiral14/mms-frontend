import { Colors } from '@blueprintjs/core'
import styled from 'styled-components'

const bgColors = {
  warning: '#fff',
  info: Colors.INDIGO5,
  error: 'red',
}
export const Container = styled.div<{ variation: string }>`
  padding: 5px;

  background-color: ${(p) =>
    bgColors?.[p.variation as keyof typeof bgColors] ?? 'blue'};
`
