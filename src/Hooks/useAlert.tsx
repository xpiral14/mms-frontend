import React, { createContext, useContext, useState } from 'react'
import { Alert, AlertProps } from '@blueprintjs/core'

export interface AlertContextProps {
  openAlert: (
    alertProps: Omit<AlertProps, 'isOpen'> & { text: React.ReactNode }
  ) => string
  closeAlert: (alertId: string) => void
}
export const AlertContext = createContext<AlertContextProps>(null as any)

export const useAlert = () => {
  return useContext(AlertContext)
}

const AlertContextProvider: React.FC<any> = ({ children }) => {
  const [alerts, setAlerts] = useState<
    (Omit<AlertProps, 'isOpen'> & { id: string; text: React.ReactNode })[]
      >([])
  const [openedAlerts, setOpenedAlerts] = useState<{ [x: string]: boolean }>({})

  const openAlert = (
    alertProps: Omit<AlertProps, 'isOpen'> & { text: React.ReactNode }
  ) => {
    const alertId = (Math.random() * 1243).toString()

    setAlerts((prev) => [
      ...prev,
      {
        ...alertProps,
        id: alertId,
        canEscapeKeyCancel: true,
        canOutsideClickCancel: true,
        onClose: (confirmed, event) => {
          alertProps?.onClose?.(confirmed, event)
          closeAlert(alertId)
        },
        handleConfirm: () => {
          Promise.resolve(alertProps?.onConfirm?.()).then(() => {
            closeAlert(alertId)
          })
        },
      },
    ])

    setTimeout(() => {
      setOpenedAlerts((prev) => ({ ...prev, [alertId]: true }))
    }, 100)

    return alertId
  }

  const closeAlert = (alertId: string) => {
    setOpenedAlerts((prev) => ({ ...prev, [alertId]: false }))

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
      setOpenedAlerts((prev) => {
        const copy = { ...prev }
        delete prev[alertId]
        return copy
      })
    }, 200)
  }

  return (
    <AlertContext.Provider
      value={{
        openAlert,
        closeAlert,
      }}
    >
      {children}
      <div>
        {Boolean(alerts.length) &&
          alerts.map((alertProps) => (
            <Alert
              style={{
                zIndex: 1000,
              }}
              key={alertProps.id}
              {...alertProps}
              isOpen={openedAlerts[alertProps.id]}
            >
              {alertProps.text}
            </Alert>
          ))}
      </div>
    </AlertContext.Provider>
  )
}
export default AlertContextProvider
