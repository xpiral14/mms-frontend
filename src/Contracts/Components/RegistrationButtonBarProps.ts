import { ButtonProps } from '@blueprintjs/core'
import { Screen, } from './ScreenProps'
import { ScreenIds } from '../Hooks/useScreen'
export enum RegistrationButtons {
  NEW,
  SAVE,
  CANCEL,
  DETAIL,
  EDIT,
  DELETE,
  VIZUALIZE,
  CLOSE,
  RELOAD_ALL
}
export type ReportButtonProps = {
  text: string,
  screenId: ScreenIds,
  screenProps?: Record<string, any>
}
export type StopLoadFunc = () => void
export interface RegistrationButtonBarProps {
  exitButton?: boolean
  buttonNewProps?: ButtonProps
  buttonSaveProps?: ButtonProps
  buttonEditProps?: ButtonProps
  buttonCancelProps?: ButtonProps
  buttonDeleteProps?: ButtonProps
  buttonExitProps?: ButtonProps
  buttonVisualizeProps?: ButtonProps

  handleNewButtonOnClick?: () => void
  handleSaveButtonOnClick?: (stopLoad: StopLoadFunc) => void
  handleEditButtonOnClick?: () => void
  handleCancelButtonOnClick?: () => void
  handleDeleteButtonOnClick?: (stopLoad: StopLoadFunc) => void
  handleExitButtonOnClick?: () => void
  handleReloadScreenOnClick?: () => void
  handleButtonInfoOnClick?: () => void
  handleButtonVisualizeOnClick?: () => void
  buttonsToShow?: RegistrationButtons[]
  screen?: Screen,
  reports?: ReportButtonProps[]
}
