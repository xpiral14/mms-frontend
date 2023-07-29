import React from 'react'
import 'jspanel4/es6module/extensions/modal/jspanel.modal'
import 'jspanel4/dist/jspanel.min.css'
import 'normalize.css/normalize.css'
import ScreenProvider from './Hooks/useScreen'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/table/lib/css/table.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css'
import '@blueprintjs/popover2/lib/css/blueprint-popover2.css'
import AlertContextProvider from './Hooks/useAlert'
import './globalStyle.css'


import Routes from './Routes'
import AuthProvider from './Hooks/useAuth'
import ToastContextProvider from './Hooks/useToast'
import Pusher from 'pusher-js'
import DialogProvider from './Hooks/useDialog'

if (process.env.NODE_ENV !== 'production') {
  Pusher.logToConsole = true
}

(window as any).Pusher = Pusher

const App = () => {
  return (
    <div>
      <Routes />
    </div>
  )
}

export default () => {
  return (
    <ToastContextProvider>
      <AlertContextProvider>
        <AuthProvider>
          <ScreenProvider>
            <DialogProvider>
              <App />
            </DialogProvider>
          </ScreenProvider>
        </AuthProvider>
      </AlertContextProvider>
    </ToastContextProvider>
  )
}
