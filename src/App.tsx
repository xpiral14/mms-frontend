import React from 'react'
import { ThemeProvider } from '@material-ui/core/styles'
import Routes from './Routes'
import GlobalStyle from './Styles/GlobalStyle'

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={GlobalStyle}>
        <Routes />
      </ThemeProvider>
    </>
  )
}

export default App
