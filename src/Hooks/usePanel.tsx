/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, lazy, Suspense, useContext, useState } from 'react'
import { jsPanel, Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import CreatePortal from '../Components/createPortal'
import jsPanelDefaultOptions from '../Config/jsPanelDefaultOptions'
import { useAlert } from './useAlert'


interface ContextPanelOptions extends PanelOptions {
  id: string
  path: string
}

type PanelObject = {
  panel: ContextPanelOptions
  component: any
}


export type PanelContext = {
  panels: {
    [x: string]: {
      panel: Panel
      component: any
    }
  }
  setPanels: React.Dispatch<
    React.SetStateAction<{
      [x: string]: {
        panel: Panel
        component: any
      }
    }>
  >
  addPanel: (
    panelOptions: ContextPanelOptions,
    isModal?: boolean | undefined
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

  const addPanel = (
    panelOptions: ContextPanelOptions,
    modal = false
  ) => {
    let Component: any
    try {
      Component = lazy(() => import(`../Screens/${panelOptions.path}`))
    } catch (error) {
      return openAlert({ text: 'Tela inválida' })
    }

    if (panels[panelOptions.id]) {
      return panels[panelOptions.id].panel.front()
    }

    const options = {
      ...jsPanelDefaultOptions,
      ...panelOptions,
      ziBase: 4,
      id: panelOptions.id.replace(/ /g, '-').toLowerCase(),
      headerTitle: panelOptions.headerTitle,
      onclosed: () => {
        setPanels((prev) => {
          const appPanels = { ...prev }
          if (appPanels[panelOptions.id]) {
            delete appPanels[panelOptions.id]
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
      [panelOptions.id]: { panel, component: Component },
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
