import { Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import {allScreens} from '../../Statics/screens'

export type ScreenIds = keyof  typeof  allScreens

export interface ContextPanelOptions extends PanelOptions {
  id: ScreenIds
  path: string
  parentScreenId?: ScreenIds
  isSubScreen?: boolean
}

export type ScreenObject = {
  screen: Panel
  component: any
  componentProps: any
  parentScreen?: Panel
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
    panelOptions: ContextPanelOptions,
    isModal?: boolean | undefined
  ) => void

  openSubScreen<T = any>(
    screen: Omit<ContextPanelOptions, 'path'>,
    parentScreenId: ScreenIds,
    props?: T
  ): void
}
