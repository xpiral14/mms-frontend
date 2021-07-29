import React, { Context, createContext, useContext, useState } from 'react'
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
    ScreenStatus.VISUALIZE
  )
  return (
    <windowContext.Provider
      value={{ payload: payload, setPayload, screenStatus, setScreenStatus }}
    >
      {children}
    </windowContext.Provider>
  )
}

export default WindowContextProvider
