import {
  Button,
  IconName,
  Menu,
  MenuItem,
  Navbar,
  NavbarGroup,
  Popover,
  Position,
} from '@blueprintjs/core'
import { PanelOptions } from 'jspanel4/es6module/jspanel'
import React, { useMemo } from 'react'
import { useAlert } from '../../Hooks/useAlert'
import { useAuth } from '../../Hooks/useAuth'
import { usePanel } from '../../Hooks/usePanel'

type MenuType = { [key: string]: MenuItemType }
type NavBarProps = {
  menuItems: MenuType
}

type MenuItemType = {
  name: string
  screen: PanelOptions,
  icon?: IconName
  isMain?: boolean
  component?: string
  items?: MenuType
}

const NavBar: React.FC<NavBarProps> = ({ menuItems }) => {
  const { addPanel, panels } = usePanel()
  const buildMenu = (m: MenuType) => {
    const menuItemsArray = Object.values(m)
    const menuArray: any[] = []
    menuItemsArray.forEach((menu) => {
      let Component
      if (menu?.items) {
        const menuItems = buildMenu(menu.items!)
        const MenuItems = () => <>{menuItems}</>
        if (menu.isMain) {
          Component = () => (
            <Popover
              hasBackdrop={false}
              position={Position.BOTTOM}
              content={
                <Menu>
                  <MenuItems />
                </Menu>
              }
            >
              <Button icon={menu.icon} text={menu.name} />
            </Popover>
          )
          return menuArray.push(<Component key={menu.name} />)
        }
        return menuArray.push(
          <MenuItem key={menu.icon} icon={menu?.icon} text={menu.name}>
            <MenuItems />
          </MenuItem>
        )
      }
      menuArray.push(
        <MenuItem
          key={menu.name}
          text={menu?.name}
          icon={menu?.icon}
          onClick={() => {
            addPanel(menu.screen as any)
          }}
        />
      )
    })
    return menuArray
  }
  const BuildedMenu = useMemo(
    () => () => <>{buildMenu(menuItems)}</>,
    [menuItems, panels]
  )
  const { logout } = useAuth()
  const { openAlert } = useAlert()

  return (
    <Navbar style={{ display: 'flex', justifyContent: 'space-between' }}>
      <NavbarGroup>
        <BuildedMenu />
      </NavbarGroup>
      <NavbarGroup>
        <Button
          text='Logout'
          onClick={() => {
            openAlert({
              text: 'Você quer mesmo sair do sistema?',
              onConfirm: logout,
            })
          }}
        />
      </NavbarGroup>
    </Navbar>
  )
}

export default NavBar
