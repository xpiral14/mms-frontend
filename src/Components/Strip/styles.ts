import styled from 'styled-components'

const bgColors = {
  'warning': 'yellow',
  'info': 'blue',
  'error': 'red'
} 
export const  Container = styled.div<{variation: string}>`
  height: 10px ;

  background-color: ${p => bgColors?.[p.variation as keyof typeof bgColors] ?? 'blue' };

`
