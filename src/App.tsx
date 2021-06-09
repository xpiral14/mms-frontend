/* eslint-disable react/display-name */
import React from 'react'
import 'jspanel4/es6module/extensions/modal/jspanel.modal'
import 'jspanel4/dist/jspanel.min.css'
import 'normalize.css/normalize.css'
import PanelProvider from './Hooks/usePanel'
import NavBar from './Containers/NavBar'
import '@blueprintjs/core/lib/css/blueprint.css'
import '@blueprintjs/icons/lib/css/blueprint-icons.css'
import menuItems from './Statics/menu'
const App = () => {
  return <NavBar menuItems={menuItems} />
}

export default () => (
  <PanelProvider>
    <App />
  </PanelProvider>
)
