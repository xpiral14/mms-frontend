import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
} from 'react'
import { jsPanel, Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'
import { useAlert } from './useAlert'
import { useAuth } from './useAuth'
import GridProvider from './useGrid'
import WindowContextProvider from './useWindow'
import {
  ContextPanelOptions,
  ScreenContext,
  ScreenIds,
  ScreenObject,
} from '../Contracts/Hooks/useScreen'
import { Intent, ProgressBar } from '@blueprintjs/core'
import allScreens from '../Statics/screens'
import { Screen } from '../Contracts/Components/ScreenProps'
import { useCallback } from 'react'
import findContainment from '../Util/findContainement'
import { IS_DEVELOPMENT_MODE } from '../Constants'

export const screenContext = createContext<ScreenContext>(null as any)

export const useScreen = () => {
  const context = useContext(screenContext)

  if (!context) {
    throw new Error('This component must be child of PanelContextProvider')
  }

  return context
}
jsPanel.ziBase = 4

const offsetMenuHeight = IS_DEVELOPMENT_MODE ? 60 : 50
export default function ScreenProvider({ children }: any) {
  const [screens, setScreens] = useState<{
    [x: string]: ScreenObject
  }>({})
  const { auth, hasSomeOfPermissions } = useAuth()
  const [screenError, setScreenError] = useState<{
    screenId?: ScreenIds
    error?: string
  }>({})
  useEffect(() => {
    if (screenError.screenId) {
      screens[screenError.screenId]?.screen?.close()
      openAlert({
        text: screenError.error ?? 'A tela não existe no sistema',
        intent: Intent.DANGER,
      })
      setScreenError({})
    }
  }, [screenError, screens])

  useEffect(() => {
    if (!auth) {
      Object.values(screens).forEach((screen) => {
        screen.screen.close()
      })
    }
  }, [auth, screens])

  useEffect(() => {
    const handler = (
      event: React.DragEvent<HTMLDivElement> & {
        panel: Panel & HTMLDivElement
        detail: any
      }
    ) => {
      let positionObject = null
      const panelContainment = findContainment(
        event.panel,
        document.querySelector('.main-screen-container')!
      )

      const clientRect = event.panel.getBoundingClientRect()
      if (
        !panelContainment.top &&
        !panelContainment.right &&
        !panelContainment.bottom &&
        !panelContainment.left
      )
        return

      positionObject = {
        offsetX: panelContainment.right
          ? document.body.offsetWidth - clientRect.width
          : panelContainment.left
          ? 0
          : clientRect.left,
        offsetY: panelContainment.top
          ? 0
          : panelContainment.bottom
          ? document.body.offsetHeight - clientRect.height - offsetMenuHeight
          : clientRect.top - offsetMenuHeight,
        my: 'left-top',
        at: 'left-bottom',
        of: '.main-menu',
      }
      event.panel.reposition(positionObject)
    }
    document.addEventListener('jspaneldragstop' as any, handler, false)
    document.addEventListener('jspanelresizestop' as any, handler, false)
    return () => {
      document.removeEventListener('jspaneldrag' as any, handler)
      document.removeEventListener('jspanelresizestop' as any, handler)
    }
  }, [])
  const { openAlert } = useAlert()

  const changeScreenHeight = (screen: Panel, size: number | string) => () => {
    screen.resize({
      height: size,
    })
  }
  const removeScreen = (screenId: ScreenIds) => {
    setScreens((prev) => {
      const appPanels = { ...prev }
      if (appPanels[screenId]) {
        delete appPanels[screenId]
      }
      return appPanels
    })
  }

  const openScreen = useCallback(
    (
      { forceOpen, ...screenOptions }: Omit<ContextPanelOptions, 'path'>,
      props = {} as any,
      modal = false
    ) => {
      const screenData = allScreens[screenOptions.id]

      if (screens[screenOptions?.id]) {
        if (forceOpen) {
          screens[screenOptions.id].screen.close()
          openScreen(screenOptions, props, modal)
          return
        }
        screens[screenOptions.id].screen.front()
        return
      }

      if (
        screenData.permissions?.length &&
        !hasSomeOfPermissions(screenData.permissions)
      ) {
        setScreenError({
          screenId: screenData.id,
          error:
            'Você nâo possui permissão para acessar esta tela. Fale com seu superior para entender mais.',
        })
      }

      const options = {
        ...jsPanelDefaultOptions,
        ...screenOptions,
        ziBase: 4,
        id: screenOptions.id.replace(/ /g, '-'),
        headerTitle: screenOptions.headerTitle ?? screenData.name,
        contentSize:
          screenOptions.contentSize ?? screenData.contentSize ?? '900 300',
        onclosed: () => {
          removeScreen(screenOptions.id)
        },
        container: 'div.main-screen-container',
      } as PanelOptions

      const screen = (modal ?? screenOptions.isSubScreen
        ? jsPanel.modal.create(options)
        : jsPanel.create(options)) as any as Screen

      screen.decreaseScreenSize = screenOptions.minHeight
        ? changeScreenHeight(screen, screenOptions.minHeight)
        : undefined
      screen.increaseScreenSize = screenOptions.minHeight
        ? changeScreenHeight(screen, screenOptions.maxHeight as any)
        : undefined
      screen.createElementId = function (id: string) {
        return screen.id + '-' + id
      }
      screen.id = screenOptions.id
      const Component = lazy(() => {
        return new Promise((resolve, reject) => {
          const comps = import.meta.glob('../Screens/**/*.tsx')
          let match = comps[`../Screens/${screenData.path}/index.tsx`]
          if(!match) {
            match = comps[`../Screens/${screenData.path}.tsx`]
          }
          match()
            .then((c: any) => {
              return resolve(c)
            })
            .catch(() => {
              setScreenError({
                screenId: screenOptions.id,
              })
            })
        })
      })

      setScreens((prev) => ({
        ...prev,
        [screenOptions.id]: {
          screen: screen,
          component: Component,
          componentProps: props || {},
          screenOptions: {
            ...screenOptions,
            path: screenData.path,
            windowProps: screenData.windowProps,
          },
          parentScreen: (screenOptions?.parentScreenId &&
            prev?.[screenOptions.parentScreenId as string]?.screen) as
            | Panel
            | undefined,
        },
      }))
    },
    [screens, auth]
  )

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
          <WindowContextProvider
            {...screens[panelId].screenOptions.windowProps}
          >
            <GridProvider>
              {Array.isArray(Comp) ? (
                Comp.map((C) => (
                  <Suspense
                    key={screen.id as string}
                    fallback={
                      <div className='alert alert-info'>
                        <ProgressBar intent={Intent.PRIMARY} />
                      </div>
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

  function openSubScreen<T = any>(
    panelOptions: Omit<ContextPanelOptions, 'path'>,
    parentPanelId?: ScreenIds,
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
        screens,
        setScreens,
        openScreen,
        openSubScreen,
      }}
    >
      {Boolean(Object.keys(screens).length) && renderJsPanelsInsidePortal()}
      {children}
    </screenContext.Provider>
  )
}
