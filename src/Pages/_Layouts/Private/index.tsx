import React from 'react'
import NavBar from '../../../Containers/NavBar'
import menu from '../../../Statics/menu'

const PrivateLayout: React.FC = ({children}) => {
  return (
    <div>
      <NavBar menuItems={menu as any}/>
      {children}
    </div>
  )
}

export default PrivateLayout
