import React, { createContext, useContext } from 'react'
import { Intent, Position, Toaster, ToastProps } from '@blueprintjs/core'

export interface ToastContextProps {
  showToast: (toastProps: ToastProps) => string
  showErrorToast: (toastProps: ToastProps | string) => string
  showSuccessToast: (toastProps: ToastProps | string) => string
  showWarningToast: (toastProps: ToastProps) => string
  showPrimaryToast: (toastProps: ToastProps) => string
}
const toastContext = createContext<ToastContextProps>(null as any)

export const useToast = () => {
  return useContext(toastContext)
}

const toaster = Toaster.create({ maxToasts: 4, position: Position.BOTTOM_LEFT })
const ToastContextProvider: React.FC<any> = ({ children }) => {
  const showToast = (toastProps: ToastProps) => {
    return toaster.show({
      intent: Intent.NONE,
      ...toastProps,
    })
  }

  const showErrorToast = (toastProps: ToastProps | string) => {
    return showToast({
      ...(typeof toastProps === 'string'
        ? { message: toastProps }
        : toastProps),
      intent: Intent.DANGER,
    })
  }

  const showSuccessToast = (toastProps: ToastProps | string) => {
    return showToast({
      ...(typeof toastProps === 'string'
        ? { message: toastProps }
        : toastProps),
      intent: Intent.SUCCESS,
    })
  }

  const showWarningToast = (toastProps: ToastProps) => {
    return showToast({
      ...toastProps,
      intent: Intent.WARNING,
    })
  }

  const showPrimaryToast = (toastProps: ToastProps) => {
    return showToast({
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
