import { Panel } from 'jspanel4/es6module/jspanel'

export default interface ScreenProps {
  panel: Panel & { id: string }
}
