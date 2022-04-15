import {createContext, lazy, Suspense, useContext, useEffect, useState,} from 'react'
import {jsPanel, Panel, PanelOptions} from 'jspanel4/es6module/jspanel'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'
import {useAlert} from './useAlert'
import {useAuth} from './useAuth'
import GridProvider from './useGrid'
import WindowContextProvider from './useWindow'
import {ContextPanelOptions, ScreenContext, ScreenIds, ScreenObject,} from '../Contracts/Hooks/useScreen'
import {Intent} from '@blueprintjs/core'
import {allScreens} from '../Statics/screens'
import {Screen} from '../Contracts/Components/ScreenProps'

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
  const [screens, setScreens] = useState<{
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

  const changeScreenHeight = (screen: Panel, size: number | string) => () => {
    screen.resize({
      height: size,
    })
  }

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
        setScreens((prev) => {
          const appPanels = {...prev}
          if (appPanels[screenOptions.id]) {
            delete appPanels[screenOptions.id]
          }
          return appPanels
        })
      },
    } as PanelOptions

    const screen = ((modal ?? screenOptions.isSubScreen)
      ? jsPanel.modal.create(options)
      : jsPanel.create(options)) as any as Screen

    screen.decreaseScreenSize = screenOptions.minHeight ? changeScreenHeight(screen, screenOptions.minHeight) : undefined
    screen.increaseScreenSize = screenOptions.minHeight ? changeScreenHeight(screen, screenOptions.maxHeight as any) : undefined
    screen.id = screenOptions.id

    const Component = lazy(() => {
      return new Promise((resolve) => {
        return import(`../Screens/${screenOptions.path}`)
          .then(resolve)
          .catch(() => {
            setScreenError(screenOptions.id)
          })
      })
    })

    setScreens((prev) => ({
      ...prev,
      [screenOptions.id]: {
        screen: screen,
        component: Component,
        componentProps: props || {},
        screenOptions: screenOptions,
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

  function openSubPanel<T = any>(
    panelOptions: Omit<ContextPanelOptions, 'path'>,
    parentPanelId: ScreenIds,
    props?: T
  ) {
    const screen = allScreens[panelOptions.id]
    openScreen(
      {
        headerTitle: screen.name,
        ...screen,
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
        setScreens: setScreens,
        openScreen: openScreen,
        openSubScreen: openSubPanel,
      }}
    >
      {Boolean(Object.keys(screens).length) && renderJsPanelsInsidePortal()}
      {children}
    </screenContext.Provider>
  )
}
