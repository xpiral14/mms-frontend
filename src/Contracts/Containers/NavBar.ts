import { IconName } from '@blueprintjs/core'
import { PanelOptions } from 'jspanel4/es6module/jspanel'
import {ScreenIds} from '../Hooks/useScreen'

export type MenuType = { [key: string]: MenuItemType }
export type NavBarProps = {
  menuItems: MenuType
}

export type MenuItemType = {
  name: string
  screen?: NavBarPanelOption
  icon?: IconName | JSX.Element
  isMain?: boolean
  items?: MenuType
}


export interface NavBarPanelOption extends PanelOptions {
  path: string
  id: ScreenIds,

  minHeight?: number | string
  maxHeight?: number | string
}
