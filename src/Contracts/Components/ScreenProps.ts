import { Panel } from 'jspanel4/es6module/jspanel'
import {ScreenIds} from '../Hooks/useScreen'

export interface Screen extends Panel {
  id: ScreenIds
  increaseScreenSize?: () => void
  decreaseScreenSize?: () => void
}

export default interface ScreenProps {
  screen: Screen
}

export interface SubScreenProps extends ScreenProps {
  parentScreen: Screen
}
