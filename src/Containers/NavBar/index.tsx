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
import React, { useMemo } from 'react'
import { usePanel } from '../../Hooks/usePanel'

type MenuType = { [key: string]: MenuItemType }
type NavBarProps = {
  menuItems: MenuType
}

type MenuItemType = {
  name: string
  screen: string
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
            addPanel(menu.name, menu.screen)
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

  return (
    <Navbar>
      <NavbarGroup>
        <BuildedMenu />
      </NavbarGroup>
    </Navbar>
  )
}

export default NavBar
