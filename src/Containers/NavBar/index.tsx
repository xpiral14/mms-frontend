import {Button, Menu, MenuItem, Navbar, NavbarGroup, Popover, Position,} from '@blueprintjs/core'
import React, {useMemo} from 'react'
import {MenuType, NavBarProps} from '../../Contracts/Containers/NavBar'
import {useAlert} from '../../Hooks/useAlert'
import {useAuth} from '../../Hooks/useAuth'
import {useScreen} from '../../Hooks/useScreen'


const NavBar: React.FC<NavBarProps> = ({menuItems}) => {
  const {openScreen, screens: screens} = useScreen()
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
          <MenuItem tagName="button" key={menu.icon} icon={menu?.icon} text={menu.name}>
            <MenuItems/>
          </MenuItem>
        )
      }
      menuArray.push(
        <MenuItem
          key={menu.name}
          tagName="button"
          text={menu?.name}
          icon={menu?.icon}
          onClick={() => {
            openScreen(menu.screen as any)
          }}
        />
      )
    })
    return menuArray
  }
  const BuiltMenu = useMemo(
    () => () => <>{buildMenu(menuItems)}</>,
    [menuItems, screens]
  )
  const { logout } = useAuth()
  const { openAlert } = useAlert()

  return (
    <Navbar style={{ display: 'flex', justifyContent: 'space-between' }}>
      <NavbarGroup>
        <BuiltMenu />
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
