/* eslint-disable react/display-name */
import React from 'react'
import 'jspanel4/es6module/extensions/modal/jspanel.modal'
import 'jspanel4/dist/jspanel.min.css'
import 'normalize.css/normalize.css'
import PanelProvider from './Hooks/usePanel'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import AlertContextProvider from './Hooks/useAlert'
import Routes from './Routes'
import AuthProvider from './Hooks/useAuth'
const App = () => {
  return (
    <div>
      <Routes />
    </div>
  )
}

export default () => (
  <AlertContextProvider>
    <PanelProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </PanelProvider>
  </AlertContextProvider>
)
