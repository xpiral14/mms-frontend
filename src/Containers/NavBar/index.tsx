import {
  ButtonGroup,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Position,
} from '@blueprintjs/core'
import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2'
import React, { useMemo } from 'react'
import { MenuType, NavBarProps } from '../../Contracts/Containers/NavBar'
import { useAlert } from '../../Hooks/useAlert'
import { useAuth } from '../../Hooks/useAuth'
import { useScreen } from '../../Hooks/useScreen'
import { IoMdBusiness } from 'react-icons/io'
import { useCallback } from 'react'
import Notification from '../Notification'
import Button from '../../Components/Button'
const NavBar: React.FC<NavBarProps> = ({ menuItems }) => {
  const { company, auth, hasSomeOfPermissions } = useAuth()

  const { openScreen } = useScreen()
  const buildMenu = useCallback(
    (m: MenuType) => {
      const menuItemsArray = Object.values(m)
      const menuArray: any[] = []
      menuItemsArray.forEach((menu) => {
        if (menu?.items) {
          let Component
          const menuItems = buildMenu(menu.items!)
          const MenuItems = () => <>{menuItems}</>
          if (menu.permissions && !hasSomeOfPermissions(menu.permissions)) {
            return <></>
          }
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
        if (
          menu.screen?.permissions &&
          !hasSomeOfPermissions(menu.screen.permissions)
        ) {
          return
        }
        
        if (menu.isMain && menu.screen) {
          return menuArray.push(
            <Button
              icon={menu.icon}
              text={menu.name}
              onClick={() => openScreen(menu.screen!)}
            />
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
    },
    [hasSomeOfPermissions, openScreen]
  )
  const BuiltMenu = useMemo(
    () => () => <>{buildMenu(menuItems)}</>,
    [buildMenu]
  )
  const { logout } = useAuth()
  const { openAlert } = useAlert()

  return (
    <div className='main-menu'>
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
          <Popover2 content={<Notification />} placement='bottom-start'>
            <Button icon='notifications' help='Notificações' />
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
    </div>
  )
}

export default NavBar
