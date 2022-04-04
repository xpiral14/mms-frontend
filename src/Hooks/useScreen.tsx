import {createContext, lazy, Suspense, useContext, useEffect, useState,} from 'react'
import {jsPanel, Panel} from 'jspanel4/es6module/jspanel'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'
import {useAlert} from './useAlert'
import {useAuth} from './useAuth'
import GridProvider from './useGrid'
import WindowContextProvider from './useWindow'
import {ContextPanelOptions, ScreenContext, ScreenIds, ScreenObject} from '../Contracts/Hooks/useScreen'
import {Intent} from '@blueprintjs/core'
import {allScreens} from '../Statics/screens'

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
  const [screenError, setScreenError] = useState(null as any)
  useEffect(() => {
    if (screenError && screens[screenError]) {
      screens[screenError]?.screen?.close()
      openAlert({
        text: 'A tela não existe no sistema',
        intent: Intent.DANGER,
      })
      setScreenError(null)
    }
  }, [screenError, screens])
  
  const { auth } = useAuth()

  useEffect(() => {
    if (!auth) {
      Object.values(screens).forEach((screen) => {
        screen.screen.close()
      })
    }
  }, [auth])

  const { openAlert } = useAlert()

  const openScreen = (
    screenOptions: ContextPanelOptions,
    props = {} as any,
    modal = false
  ) => {
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

    const Component = lazy(() => {
      return new Promise((resolve) => {
        return import(`../Screens/${screenOptions.path}`)
          .then(resolve)
          .catch(() => {
            setScreenError(screenOptions.id)
          })
      })
    })
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
          <WindowContextProvider>
            <GridProvider>
              {Array.isArray(Comp) ? (
                Comp.map((C) => (
                  <Suspense
                    key={screen.id as string}
                    fallback={
                      <div className='alert alert-info'>Loading...</div>
                    }
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
            </GridProvider>
          </WindowContextProvider>
        </CreatePortal>
      )
    })
  }

  const openSubPanel = (
    panelOptions: Omit<ContextPanelOptions, 'path'>,
    parentPanelId: ScreenIds,
    props?: any
  ) => {
    const screen = allScreens[panelOptions.id]
    openScreen(
      {
        ...screen,
        headerTitle: screen.name,
        parentScreenId: parentPanelId,
        ...panelOptions,
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
