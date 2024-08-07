import { ButtonProps, IconName } from '@blueprintjs/core'
import { Screen, } from './ScreenProps'
import { DynamicReportScreenProps } from '../Screen/DynamicReportScreen'
import { ChangeEventHandler } from 'react'
export enum RegistrationButtons {
  NEW,
  SAVE,
  CANCEL,
  DETAIL,
  EDIT,
  DELETE,
  VIZUALIZE,
  CLOSE,
  RELOAD_ALL,
  IMPORT
}
export type ReportButtonProps = {
  text: string,
  icon?: IconName
}
export type StopLoadFunc = () => void
export type ReportProps<T = any> = (DynamicReportScreenProps<T> & ReportButtonProps)

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
  handleButtonImportOnClick?: ChangeEventHandler<HTMLInputElement>
  importFileTypes?: string[],
  buttonsToShow?: RegistrationButtons[]
  screen?: Screen,
  reports?: ReportProps[]
}
