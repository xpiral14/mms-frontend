import React from 'react'
import AppVersion from '../../../Containers/AppVersion'
import NavBar from '../../../Containers/NavBar'
import menu from '../../../Statics/menu'

const PrivateLayout: React.FC = ({ children }) => {
  return (
    <div style={{ position: 'relative' }}>
      <NavBar menuItems={menu as any} />
      {children}

      <AppVersion />
    </div>
  )
}

export default PrivateLayout
