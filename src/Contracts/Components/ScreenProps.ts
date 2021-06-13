import { Panel } from 'jspanel4/es6module/jspanel'

export interface Screen extends Panel {
  id: string
}
export default interface ScreenProps {
  screen: Screen
}

export interface SubScreenProps extends ScreenProps {
  parentScreen: Screen
}
