import React, { Context, createContext, useContext, useState } from 'react'
import { ScreenStatus } from '../Constants/Enums'

type WindowContext<P = any> = {
  payload: P
  setPayload: React.Dispatch<React.SetStateAction<P>>
  screenStatus: ScreenStatus
  setScreenStatus: React.Dispatch<React.SetStateAction<ScreenStatus>>
}

const windowContext = createContext<WindowContext>(null as any)

export function useWindow<C = any>() {
  const context = useContext<WindowContext<C>>(
    windowContext as Context<WindowContext<C>>
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
