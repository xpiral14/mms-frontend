import React, { createContext, useContext } from 'react'
import { Intent, Position, Toaster, ToastProps } from '@blueprintjs/core'

export interface ToastContextProps {
  showToast: (toastProps: ToastProps) => void
  showErrorToast: (toastProps: ToastProps | string) => void
  showSuccessToast: (toastProps: ToastProps | string) => void
  showWarningToast: (toastProps: ToastProps) => void
  showPrimaryToast: (toastProps: ToastProps) => void
}
const toastContext = createContext<ToastContextProps>(null as any)

export const useToast = () => {
  return useContext(toastContext)
}

const toaster = Toaster.create({ maxToasts: 4, position: Position.BOTTOM_LEFT })
const ToastContextProvider: React.FC<any> = ({ children }) => {
  const showToast = (toastProps: ToastProps) => {
    toaster.show({
      intent: Intent.NONE,
      ...toastProps,
    })
  }

  const showErrorToast = (toastProps: ToastProps | string) => {
    showToast({
      ...(typeof toastProps === 'string'
        ? { message: toastProps }
        : toastProps),
      intent: Intent.DANGER,
    })
  }

  const showSuccessToast = (toastProps: ToastProps | string) => {
    showToast({
      ...(typeof toastProps === 'string'
        ? { message: toastProps }
        : toastProps),
      intent: Intent.SUCCESS,
    })
  }

  const showWarningToast = (toastProps: ToastProps) => {
    showToast({
      ...toastProps,
      intent: Intent.WARNING,
    })
  }

  const showPrimaryToast = (toastProps: ToastProps) => {
    showToast({
      ...toastProps,
      intent: Intent.PRIMARY,
    })
  }

  return (
    <toastContext.Provider
      value={{
        showToast,
        showErrorToast,
        showSuccessToast,
        showWarningToast,
        showPrimaryToast,
      }}
    >
      {children}
    </toastContext.Provider>
  )
}
export default ToastContextProvider
