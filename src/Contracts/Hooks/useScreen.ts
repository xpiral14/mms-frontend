import { Panel, PanelOptions } from 'jspanel4/es6module/jspanel'

export interface ContextPanelOptions extends PanelOptions {
  id: string
  path: string
  parentScreenId?: string
  isSubsCreen?: boolean
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

  openSubScreen: (
    screen: ContextPanelOptions,
    parentScreenId: string,
    props?: any
  ) => void
}
