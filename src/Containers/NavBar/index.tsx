import {
  Button,
  ButtonGroup,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  // Popover,
  Position,
} from '@blueprintjs/core'
import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2'
import React, { useMemo } from 'react'
import { MenuType, NavBarProps } from '../../Contracts/Containers/NavBar'
import { useAlert } from '../../Hooks/useAlert'
import { useAuth } from '../../Hooks/useAuth'
import { useScreen } from '../../Hooks/useScreen'
import { IoMdBusiness } from 'react-icons/io'
const NavBar: React.FC<NavBarProps> = ({ menuItems }) => {
  const { openScreen, screens: screens } = useScreen()
  const buildMenu = (m: MenuType) => {
    const menuItemsArray = Object.values(m)
    const menuArray: any[] = []
    menuItemsArray.forEach((menu) => {
      let Component
      if (menu?.items) {
        const menuItems = buildMenu(menu.items!)
        const MenuItems = () => <>{menuItems}</>
        if (menu.isMain) {
          Component = () =>
            menuItems.length ? (
              <Popover2
                hasBackdrop={false}
                position={Position.BOTTOM}
                interactionKind={Popover2InteractionKind.HOVER}
                content={
                  <Menu>
                    <MenuItems />
                  </Menu>
                }
              >
                <Button icon={menu.icon} text={menu.name} />
              </Popover2>
            ) : (
              <Button icon={menu.icon} text={menu.name} />
            )
          return menuArray.push(<Component key={menu.name} />)
        }
        return menuArray.push(
          <MenuItem
            tagName='button'
            key={menu.name}
            icon={menu?.icon}
            text={menu.name}
            onClick={() => {
              if (!menu?.screen) return
              openScreen(menu.screen)
            }}
          >
            <MenuItems />
          </MenuItem>
        )
      }
      menuArray.push(
        <MenuItem
          key={menu.name}
          tagName='button'
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

  const { company, auth } = useAuth()
  return (
    <Navbar style={{ display: 'flex', justifyContent: 'space-between' }}>
      <NavbarGroup>
        <ButtonGroup>
          <BuiltMenu />
        </ButtonGroup>
      </NavbarGroup>
      <NavbarGroup>
        <Popover2
          fill
          placement='bottom-start'
          interactionKind={Popover2InteractionKind.HOVER}
          content={
            <Menu style={{ width: 250 }}>
              <MenuItem
                text='Meus dados'
                icon='people'
                onClick={() =>
                  openScreen({
                    id: 'user-data',
                    contentSize: '900 110',
                  })
                }
              />
              <MenuItem
                text='Dados da empresa'
                icon={<IoMdBusiness size={16} />}
                onClick={() =>
                  openScreen({
                    id: 'company-data',
                    contentSize: '900 335',
                  })
                }
              />
            </Menu>
          }
        >
          <NavbarHeading>
            {auth?.user.name} | {company?.name}{' '}
          </NavbarHeading>
        </Popover2>
        <NavbarDivider />
        <Button
          text='Logout'
          icon='log-out'
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
