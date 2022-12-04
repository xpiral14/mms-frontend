/* eslint-disable @typescript-eslint/no-unused-vars */
import { Panel, PanelOptions } from 'jspanel4/es6module/jspanel'
import DialogProps, { Dialog } from '../Components/DialogProps'

export type DialogIds = 'part-stock-warn'

export type Dialogs = Record<DialogIds, Dialog>
export interface ContextPanelOptions extends PanelOptions {
  id: DialogIds
  path: string
  parentDialogId?: DialogIds
  isSubDialog?: boolean
  minHeight?: string | number
  maxHeight?: string | number
  forceOpen?: boolean
}

export type DialogObject = {
  component: any
  componentProps: any
}

export type OpenDialogPropsParam<
  T extends Omit<DialogProps, 'path' | 'isOpen' | 'name'> = any
> = T
export type DialogContext = {
  dialogs: {
    [x: string]: DialogObject
  }
  setDialogs: React.Dispatch<
    React.SetStateAction<{
      [x: string]: DialogObject
    }>
  >
  openDialog: <OpenDialogPropsParam>(dialogProps: OpenDialogPropsParam) => void
}
