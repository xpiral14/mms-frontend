import { Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import { Permissions } from '../../Constants/Enums'
import { Screen } from '../Components/ScreenProps'

export type ScreenIds =
  | 'user-register'
  | 'customer-register'
  | 'employees-register'
  | 'product-register'
  | 'unit-register'
  | 'service-register'
  | 'order-register'
  | 'cost-posting'
  | 'company-data'
  | 'receipt-posting'
  | 'user-data'
  | 'order-service-details'
  | 'order-product-details'
  | 'order-resume'
  | 'receipts-x-costs'
  | 'assign-employee-order'
  | 'stock-register'
  | 'product-stock-management'
  | 'product-stock-warning'
  | 'reports'
  | 'supplier-register'
  | 'goods-register'
  | 'good-product-register'
  | 'distribute-goods'
  | 'dynamic-report'

export interface ScreenData {
  id: ScreenIds
  name: string
  path: string
  permissions?: Permissions[]
  subScreenOnly?: boolean
  canBeUsedAsSubScreen?: boolean
  contentSize?: string
}

export type Screens = {
  [x in ScreenIds]: ScreenData
}

export interface ContextPanelOptions extends PanelOptions {
  id: ScreenIds
  path: string
  parentScreenId?: ScreenIds
  isSubScreen?: boolean
  minHeight?: string | number
  maxHeight?: string | number
  forceOpen?: boolean
}

export type ScreenObject = {
  screen: Screen
  component: any
  componentProps: any
  parentScreen?: Panel
  screenOptions: ContextPanelOptions
}

export type ScreenContext = {
  screens: {
    [x: string]: ScreenObject
  }
  setScreens: React.Dispatch<
    React.SetStateAction<{
      [x: string]: ScreenObject
    }>
  >
  openScreen: (
    panelOptions: Omit<ContextPanelOptions, 'path'>,
    isModal?: boolean | undefined,
  ) => void

  openSubScreen<T = any>(
    screen: Omit<ContextPanelOptions, 'path'>,
    parentScreenId?: ScreenIds,
    props?: T,
  ): void
}
