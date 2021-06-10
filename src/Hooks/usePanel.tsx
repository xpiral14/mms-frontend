/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  createElement,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useState,
} from 'react'
import { jsPanel, Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import Portal from '../Components/Portal'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'

const panelDefaultOptions = {
  ...jsPanel.defaults,
}

type PanelObject = {
  panel: Panel
  component: any
}
export type PanelContext = {
  panels: {
    [x: string]: PanelObject
  }
  setPanels: React.Dispatch<
    React.SetStateAction<{
      [x: string]: PanelObject
    }>
  >
  addPanel: (
    panelName: string,
    component: any,
    isModal?: boolean | undefined,
    options?: PanelOptions | undefined
  ) => void
}

export const panelContext = createContext<PanelContext>(null as any)

export const usePanel = () => {
  const context = useContext(panelContext)

  if (!context) {
    throw new Error('This component must be child of PanelContextProvider')
  }

  return context
}

export default function PanelProvider({ children }: any) {
  const [panels, setPanels] = useState<{
    [x: string]: { panel: Panel; component: any }
  }>({})

  const addPanel = (action: string, componentPath: string, modal = false) => {
    const Component = lazy(() => import(`../Screens/${componentPath}`))
    if (panels[action]) {
      return panels[action].panel.front()
    }

    const options = {
      ...jsPanelDefaultOptions,
      id: action.replace(/ /g, '-').toLowerCase(),
      headerTitle: action,
      onclosed: () => {
        setPanels((prev) => {
          const appPanels = { ...prev }
          if (appPanels[action]) {
            delete appPanels[action]
          }
          return appPanels
        })
      },
    } as any
    const panel = modal
      ? jsPanel.modal.create(options)
      : jsPanel.create(options)
    setPanels((prev) => ({
      ...prev,
      [action]: { panel, component: Component },
    }))
  }

  const renderJsPanelsInsidePortal = () => {
    return Object.keys(panels).map((panelId) => {
      const jsPanel = panels[panelId].panel
      const Comp = panels[panelId].component
      const node = document.getElementById(`${jsPanel.id}-node`)
      let counter = 0
      if (!Comp) return null
      return (
        <CreatePortal rootNode={node} key={jsPanel.id as string}>
          {Array.isArray(Comp) ? (
            Comp.map((C) => (
              <Suspense
                key={`${jsPanel.id}-${counter++}`}
                fallback={<div className='alert alert-info'>Loading...</div>}
              >
                <C jsPanel={jsPanel} />
              </Suspense>
            ))
          ) : (
            <Suspense
              fallback={<div className='alert alert-info'>Loading...</div>}
            >
              <Comp jsPanel={jsPanel} />
            </Suspense>
          )}
        </CreatePortal>
      )
    })
  }

  return (
    <panelContext.Provider
      value={{
        panels,
        setPanels,
        addPanel,
      }}
    >
      {Boolean(Object.keys(panels).length) && renderJsPanelsInsidePortal()}
      {children}
    </panelContext.Provider>
  )
}
