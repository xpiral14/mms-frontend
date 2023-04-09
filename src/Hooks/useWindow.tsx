import React, { Context, createContext, useCallback, useContext, useState } from 'react'
import { ScreenStatus } from '../Constants/Enums'

type WindowContext<P = any> = {
  payload: P
  setPayload: React.Dispatch<React.SetStateAction<P>>
  screenStatus: ScreenStatus
  setScreenStatus: React.Dispatch<React.SetStateAction<ScreenStatus>>
  tabs?: { [x: string]: string }
  setTabs?: React.Dispatch<React.SetStateAction<{ [x: string]: string }>>
  activeTab?: string
  setActiveTab?: React.Dispatch<React.SetStateAction<string>>
  isScreenStatusVizualize: boolean
  isScreenStatusEdit: boolean
  isScreenStatusNew: boolean
  isScreenStatusSeeRegisters: boolean
  changePayloadAttribute: (key: any, value: any) => void
}

const windowContext = createContext<WindowContext>(null as any)

export function useWindow<P = Partial<any>>() {
  const context = useContext<WindowContext<Partial<P>>>(
    windowContext as Context<WindowContext<Partial<P>>>
  )

  if (!context) {
    throw new Error('Component must be wrapped by WindowContextProvider')
  }
  return context
}

const WindowContextProvider: React.FC = ({ children }) => {
  const [payload, setPayload] = useState<any>({})
  const [screenStatus, setScreenStatus] = useState<ScreenStatus>(
    ScreenStatus.SEE_REGISTERS
  )

  const changePayloadAttribute = useCallback((key: keyof typeof payload, value: any) => {
    setPayload((prev: any) => ({
      ...prev,
      [key]: value,
    }))
  }, [setPayload])
  const isScreenStatusVizualize = screenStatus === ScreenStatus.VISUALIZE
  const isScreenStatusEdit = screenStatus === ScreenStatus.EDIT
  const isScreenStatusNew = screenStatus === ScreenStatus.NEW
  const isScreenStatusSeeRegisters = screenStatus === ScreenStatus.SEE_REGISTERS
  return (
    <windowContext.Provider
      value={{
        payload,
        setPayload,
        changePayloadAttribute,
        screenStatus,
        setScreenStatus,
        isScreenStatusVizualize,
        isScreenStatusEdit,
        isScreenStatusNew,
        isScreenStatusSeeRegisters,
      }}
    >
      {children}
    </windowContext.Provider>
  )
}

export default WindowContextProvider
