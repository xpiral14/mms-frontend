import { IconName } from '@blueprintjs/core'
import { PanelOptions } from 'jspanel4/es6module/jspanel'
import { Permissions } from '../../Constants/Enums'
import {ScreenData, ScreenIds} from '../Hooks/useScreen'

export type MenuType = { [key: string]: MenuItemType }
export type NavBarProps = {
  menuItems: MenuType
}

export type MenuItemType = {
  name: string
  screen?: Partial<NavBarPanelOption> & ScreenData
  icon?: IconName | JSX.Element
  isMain?: boolean
  items?: MenuType,
  permissions?: Permissions[]
}


export interface NavBarPanelOption extends PanelOptions, Screen {
  path: string
  id: ScreenIds,

  minHeight?: number | string
  maxHeight?: number | string
}
