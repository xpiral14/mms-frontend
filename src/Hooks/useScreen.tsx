/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, lazy, Suspense, useContext, useState } from 'react'
import { jsPanel, Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'
import { useAlert } from './useAlert'

interface ContextPanelOptions extends PanelOptions {
  id: string
  path: string
  parentScreenId?: string
  isSubsCreen?: boolean
}

type ScreenObject = {
  screen: Panel
  component: any
  componentProps: any
  parentScreen?: Panel
}

export type ScreenContext = {
  screens: {
    [x: string]: ScreenObject
  }
  setScreens: React.Dispatch<
    React.SetStateAction<{
      [x: string]: ScreenObject
    }>
  >
  openScreen: (
    panelOptions: ContextPanelOptions,
    isModal?: boolean | undefined
  ) => void

  openSubScreen: (
    screen: ContextPanelOptions,
    parentScreenId: string,
    props: any
  ) => void
}

export const screenContext = createContext<ScreenContext>(null as any)

export const useScreen = () => {
  const context = useContext(screenContext)

  if (!context) {
    throw new Error('This component must be child of PanelContextProvider')
  }

  return context
}
jsPanel.ziBase = 4

export default function ScreenProvider({ children }: any) {
  const [screens, setPanels] = useState<{
    [x: string]: ScreenObject
  }>({})
  const { openAlert } = useAlert()

  const openScreen = (
    screenOptions: ContextPanelOptions,
    props = {} as any,
    modal = false
  ) => {
    let Component: any
    try {
      Component = lazy(() => import(`../Screens/${screenOptions.path}`))
    } catch (error) {
      return openAlert({ text: 'Tela inválida' })
    }

    if (screens[screenOptions.id]) {
      return screens[screenOptions.id].screen.front()
    }

    const options = {
      ...jsPanelDefaultOptions,
      ...screenOptions,
      ziBase: 4,
      id: screenOptions.id.replace(/ /g, '-'),
      headerTitle: screenOptions.headerTitle,
      onclosed: () => {
        setPanels((prev) => {
          const appPanels = { ...prev }
          if (appPanels[screenOptions.id]) {
            delete appPanels[screenOptions.id]
          }
          return appPanels
        })
      },
    } as any
    const screen = modal
      ? jsPanel.modal.create(options)
      : jsPanel.create(options)

    setPanels((prev) => ({
      ...prev,
      [screenOptions.id]: {
        screen: screen,
        component: Component,
        componentProps: props || {},
        parentScreen: (screenOptions?.parentScreenId &&
          prev?.[screenOptions.parentScreenId as string]?.screen) as
          | Panel
          | undefined,
      },
    }))
  }

  const renderJsPanelsInsidePortal = () => {
    return Object.keys(screens).map((panelId) => {
      const screen = screens[panelId].screen
      const Comp = screens[panelId].component
      const parentScreen = screens[panelId].parentScreen
      const { componentProps } = screens[panelId]
      const node = document.getElementById(`${screen.id}-node`)
      if (!Comp) return null
      return (
        <CreatePortal rootNode={node} key={screen.id as string}>
          {Array.isArray(Comp) ? (
            Comp.map((C) => (
              <Suspense
                key={screen.id as string}
                fallback={<div className='alert alert-info'>Loading...</div>}
              >
                <C
                  screen={screen}
                  {...{
                    ...componentProps,
                    ...(parentScreen
                      ? {
                        parentScreen,
                      }
                      : {}),
                  }}
                />
              </Suspense>
            ))
          ) : (
            <Suspense
              fallback={<div className='alert alert-info'>Loading...</div>}
            >
              <Comp
                screen={screen}
                {...{
                  ...componentProps,
                  ...(parentScreen
                    ? {
                      parentScreen,
                    }
                    : {}),
                }}
              />
            </Suspense>
          )}
        </CreatePortal>
      )
    })
  }

  const openSubPanel = (
    panelOptions: ContextPanelOptions,
    parentPanelId: string,
    props: any
  ) => {
    openScreen(
      {
        ...panelOptions,
        id: `parent-${parentPanelId}-${panelOptions.id}`,
        parentScreenId: parentPanelId,
      },
      props
    )
  }

  return (
    <screenContext.Provider
      value={{
        screens: screens,
        setScreens: setPanels,
        openScreen: openScreen,
        openSubScreen: openSubPanel,
      }}
    >
      {Boolean(Object.keys(screens).length) && renderJsPanelsInsidePortal()}
      {children}
    </screenContext.Provider>
  )
}
