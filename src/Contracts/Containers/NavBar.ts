import { IconName } from '@blueprintjs/core'
import { PanelOptions } from 'jspanel4/es6module/jspanel'

export type MenuType = { [key: string]: MenuItemType }
export type NavBarProps = {
  menuItems: MenuType
}

export type MenuItemType = {
  name: string
  screen?: NabBarMPanelOption
  icon?: IconName
  isMain?: boolean
  items?: MenuType
}


export interface NabBarMPanelOption extends PanelOptions {
  path: string
  id: string
}