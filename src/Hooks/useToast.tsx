import React, { createContext, useContext } from 'react'
import { Position, Toaster, ToastProps } from '@blueprintjs/core'

export interface ToastContextProps {
  showToast: (toastProps: ToastProps) => void
}
const toastContext = createContext<ToastContextProps>(null as any)

export const useToast = () => {
  return useContext(toastContext)
}

const toaster = Toaster.create({ maxToasts: 4, position: Position.BOTTOM_LEFT })
const ToastContextProvider: React.FC<any> = ({ children }) => {
  const showToast = (toastProps: ToastProps) => {
    toaster.show({
      ...toastProps,
    })
  }

  return (
    <toastContext.Provider
      value={{
        showToast: showToast,
      }}
    >
      {children}
    </toastContext.Provider>
  )
}
export default ToastContextProvider
