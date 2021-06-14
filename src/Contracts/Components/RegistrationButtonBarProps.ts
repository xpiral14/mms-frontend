import { ButtonProps } from '@blueprintjs/core'
import { ScreenStatus } from '../../Constants/Enums'
import React from 'react'

export interface RegistrationButtonBarProps {
  exitButton?: boolean
  status: ScreenStatus
  setStatus: React.Dispatch<React.SetStateAction<ScreenStatus>>
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
}
