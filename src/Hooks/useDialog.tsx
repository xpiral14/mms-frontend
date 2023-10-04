/* eslint-disable @typescript-eslint/no-unused-vars */
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
  DialogContext,
  DialogIds,
  DialogObject,
  OpenDialogPropsParam,
} from '../Contracts/Hooks/useDialog'
import { Intent, ProgressBar } from '@blueprintjs/core'
import allDialogs from '../Statics/dialogs'
import DialogProps, { Dialog } from '../Contracts/Components/DialogProps'
import { useCallback } from 'react'
import ErrorBoundary from '../Containers/ErrorBoundary'

export const dialogContext = createContext<DialogContext>(null as any)

export const useDialog = () => {
  const context = useContext(dialogContext)

  if (!context) {
    throw new Error('This component must be child of DialogContextProvider')
  }

  return context
}
jsPanel.ziBase = 4

export default function DialogProvider({ children }: any) {
  const [dialogs, setDialogs] = useState<{
    [x: string]: DialogObject
  }>({})
  const { auth, hasSomeOfPermissions } = useAuth()
  const [dialogError, setDialogError] = useState<{
    dialogId?: DialogIds
    error?: string
  }>({})

  useEffect(() => {
    if (dialogError.dialogId) {
      removeDialog(dialogError.dialogId)
      openAlert({
        text: dialogError.error ?? 'A tela não existe no sistema',
        intent: Intent.DANGER,
      })
      setDialogError({})
    }
  }, [dialogError, dialogs])

  useEffect(() => {
    if (!auth) {
      Object.values(dialogs).forEach((dialog) => {
        removeDialog(dialog.componentProps.id)
      })
    }
  }, [auth, dialogs])

  const { openAlert } = useAlert()

  const removeDialog = (dialogId: DialogIds) => {
    setDialogs((prev) => {
      const appPanels = { ...prev }
      if (appPanels[dialogId]) {
        delete appPanels[dialogId]
      }
      return appPanels
    })
  }

  const openDialog = useCallback(
    (dialogOptions: any) => {
      const dialogData = allDialogs[dialogOptions.id as DialogIds]

      if (
        dialogData.permissions?.length &&
        !hasSomeOfPermissions(dialogData.permissions)
      ) {
        setDialogError({
          dialogId: dialogData.id,
          error:
            'Você nâo possui permissão para acessar esta tela. Fale com seu superior para entender mais.',
        })
      }

      const options = {
        id: dialogOptions.id,
        title: dialogOptions.title ?? dialogData.name,
        isOpen: true,
        onClose: () => {
          removeDialog(dialogOptions.id)
        },
        name: dialogData.name,
        path: dialogData.path,
        ...dialogOptions,
      } as DialogProps

      const Component = lazy(() => {
        return new Promise((resolve) => {
          return import(`../Dialogs/${dialogData.path}`)
            .then(resolve)
            .catch((e) => {
              debugger
              setDialogError({
                dialogId: dialogOptions.id,
              })
            })
        })
      })

      setDialogs((prev) => ({
        ...prev,
        [dialogOptions.id]: {
          component: Component,
          componentProps: { ...options } || {},
        },
      }))
    },
    [dialogs, auth]
  )

  const renderDialogs = () => {
    return Object.keys(dialogs).map((panelId) => {
      const Comp = dialogs[panelId].component
      const { componentProps } = dialogs[panelId]
      const node = document.body
      const dialog = dialogs[panelId].componentProps
      if (!Comp) return null

      return (
        <ErrorBoundary key={dialog.id as string}>
          <CreatePortal rootNode={node}>
            <WindowContextProvider>
              <GridProvider>
                {Array.isArray(Comp) ? (
                  Comp.map((C) => (
                    <Suspense
                      key={dialog.id as string}
                      fallback={
                        <div className='alert alert-info'>
                          <ProgressBar intent={Intent.PRIMARY} />
                        </div>
                      }
                    >
                      <C {...componentProps} />
                    </Suspense>
                  ))
                ) : (
                  <Suspense
                    fallback={
                      <div className='alert alert-info'>Loading...</div>
                    }
                  >
                    <Comp
                      dialog={dialog}
                      {...{
                        ...componentProps,
                      }}
                    />
                  </Suspense>
                )}
              </GridProvider>
            </WindowContextProvider>
          </CreatePortal>
        </ErrorBoundary>
      )
    })
  }

  return (
    <dialogContext.Provider
      value={{
        dialogs,
        setDialogs,
        openDialog,
      }}
    >
      {Boolean(Object.keys(dialogs).length) && renderDialogs()}
      {children}
    </dialogContext.Provider>
  )
}
