import React from 'react'
import Routes from './Routes'
import { SnackbarProvider } from 'notistack'
import UserDataProvider from './context/UserData'
import { ThemeProvider } from '@material-ui/core/styles'
import GlobalAppTheme from './Styles/GlobalAppTheme'
import AlertContextProvider from './hooks/useAlert'
const App: React.FC = () => {
  return (
    <SnackbarProvider maxSnack={3}>
      <AlertContextProvider>
        <UserDataProvider>
          <ThemeProvider theme={GlobalAppTheme}>
            <Routes />
          </ThemeProvider>
        </UserDataProvider>
      </AlertContextProvider>
    </SnackbarProvider>
  )
}

export default App
