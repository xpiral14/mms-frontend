/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, lazy, Suspense, useContext, useState } from 'react'
import { jsPanel, Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'
import { useAlert } from './useAlert'

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
    componentPath: string,
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
jsPanel.ziBase = 4
export default function PanelProvider({ children }: any) {
  const [panels, setPanels] = useState<{
    [x: string]: { panel: Panel; component: any }
  }>({})
  const { openAlert } = useAlert()
  const addPanel = (action: string, componentPath: string, modal = false) => {
    let Component: any
    try {
      Component = lazy(() => import(`../Screens/${componentPath}`))
    } catch (error) {
      return openAlert({ text: 'Tela inválida' })
    }

    if (panels[action]) {
      return panels[action].panel.front()
    }

    const options = {
      ...jsPanelDefaultOptions,
      ziBase: 4,
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
      const panel = panels[panelId].panel
      const Comp = panels[panelId].component
      const node = document.getElementById(`${panel.id}-node`)
      let counter = 0
      if (!Comp) return null
      return (
        <CreatePortal rootNode={node} key={panel.id as string}>
          {Array.isArray(Comp) ? (
            Comp.map((C) => (
              <Suspense
                key={`${panel.id}-${counter++}`}
                fallback={<div className='alert alert-info'>Loading...</div>}
              >
                <C jsPanel={panel} />
              </Suspense>
            ))
          ) : (
            <Suspense
              fallback={<div className='alert alert-info'>Loading...</div>}
            >
              <Comp panel={panel} />
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
