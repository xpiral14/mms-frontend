import { ButtonProps } from '@blueprintjs/core'
import { Screen } from './ScreenProps'


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
  handleDeleteButtonOnClick?: () => void
  handleExitButtonOnClick?: () => void
  handleReloadScreenOnClick?: () => void
  handleButtonInfoOnClick?: () => void
  handleButtonVisualizeOnClick?: () => void

  screen?: Screen
}
