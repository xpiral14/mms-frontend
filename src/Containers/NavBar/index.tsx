/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Alignment,
  Button,
  Classes,
  Menu,
  MenuItem,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
  Popover,
  Position,
} from '@blueprintjs/core'
import React, { useMemo } from 'react'

type MenuType =
  | string
  | number
  | boolean
  | null
  | MenuType[]
  | { [key: string]: MenuType }
type NavBarProps = {
  menuItems: MenuType
}

type MenuItemType = {
  name: string
  component?: string
  items?: MenuItemType[]
}
function buildMenuItems(object: any, level = 0) {
  const objectArray: any = Object.values(object)
  const array: any = []

  objectArray.forEach((objValue: any) => {
    const menuObject: any = {}
    menuObject.name = objValue.name

    if (objValue.items) {
      level += 1
      menuObject.items = buildMenuItems(objValue.items).map(({ name }: any) => (
        <MenuItem key={name} text={name} />
      ))
      array.push(menuObject)
      return
    }
    level -= level === 0 ? 0 : -1
    menuObject.name = objValue.name
    menuObject.screen = objValue.screen
    array.push(menuObject)
  })

  return array
}
let level = 0
function buildMenu(object: any) {
  const objectArray: any = Object.values(object)
  const array: any = []
  objectArray.forEach((objValue: any) => {
    if (objValue.items) {
      const items = buildMenu(objValue.items)

      const menuItems = items.map((item: any) => (
        <MenuItem icon={item?.icon} key={item.name} text={item.name} />
      ))

      const Component = () =>
        level === 0 ? (
          <Menu>{menuItems}</Menu>
        ) : (
          // <Button icon={objValue?.icon} text={objValue.name} />
          ((<MenuItem text={objValue.name}>{menuItems}</MenuItem>) as any)
        )

      array.push(<Component />)
      return
    }
    level -= level === 0 ? 0 : -1
    array.push(<Button className={Classes.MINIMAL} text={objValue.name} />)
  })

  return array
}
const NavBar: React.FC<NavBarProps> = ({ menuItems }) => {
  const BuildedMenuItems = useMemo(() => buildMenu(menuItems), [menuItems])
  console.log(buildMenuItems(menuItems))
  return (
    <Navbar>
      <NavbarGroup>{BuildedMenuItems}</NavbarGroup>
    </Navbar>
  )
}

export default NavBar
