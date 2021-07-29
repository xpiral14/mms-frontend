import { ButtonProps } from '@blueprintjs/core'
import { Screen } from './ScreenProps'

export interface RegistrationButtonBarProps {
  exitButton?: boolean
  buttonNewProps?: ButtonProps
  buttonSaveProps?: ButtonProps
  buttonEditProps?: ButtonProps
  buttonCancelProps?: ButtonProps
  buttonDeleteProps?: ButtonProps
  buttonExitProps?: ButtonProps
  handleNewButtonOnClick?: () => void
  handleSaveButtonOnClick?: () => void
  handleEditButtonOnClick?: () => void
  handleCancelButtonOnClick?: () => void
  handleDeleteButtonOnClick?: () => void
  handleExitButtonOnClick?: () => void
  handleReloadScreenOnClick?: () => void
  handleButtonInfoOnClick?: () => void
  screen?: Screen
}
