import styled, { CSSProperties } from 'styled-components'

export const Container = styled.main``

export const Header = styled.div`
  padding-bottom: 5px;
`
export const Body = styled.div``

export const styles: { [key: string]: CSSProperties } = {
  flexRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
  },
  tableRow: {
    display: 'flex',
    width: '100%',
    minHeight: '300px',
  },
}
