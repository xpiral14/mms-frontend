import React, { createContext, useContext, useState } from 'react'
import AlertDialog, { AlertDialogProps } from '../Components/Alert'

export interface AlertContextProps {
  openAlert: (alertProps: AlertDialogProps) => string
  closeAlert: (alertId: string) => void
}
export const AlertContext = createContext<AlertContextProps>(null as any)

export const useAlert = () => {
  return useContext(AlertContext)
}

const AlertContextProvider: React.FC<any> = ({ children }) => {
  const [alerts, setAlerts] = useState<(AlertDialogProps & { id: string })[]>(
    []
  )
  const [openedAlerts, setOpenedAlerts] = useState<{ [x: string]: boolean }>({})

  const openAlert = (props: AlertDialogProps) => {
    const alertId = (Math.random() * 1243).toString()

    setAlerts((prev) => [
      ...prev,
      {
        ...props,
        id: alertId,
        handleClose: () => {

          props?.handleClose?.()

          closeAlert(alertId)
        },
        handleConfirm: () => {
          Promise.resolve(props?.handleConfirm?.()).then(() => {
            closeAlert(alertId)
          })
          
        }
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
      setOpenedAlerts(prev => {
        const copy = {...prev}
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
        {alerts.length &&
          alerts.map((alertProps) => (
            <AlertDialog key={alertProps.id} {...alertProps} open = {openedAlerts[alertProps.id]} />
          ))}
      </div>
    </AlertContext.Provider>
  )
  
}
export default AlertContextProvider
