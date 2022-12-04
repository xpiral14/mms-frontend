import { DialogProps as BluePrintDialogProps } from '@blueprintjs/core'
import { Permissions } from '../../Constants/Enums'
import { DialogIds } from '../Hooks/useDialog'

export interface Dialog {
  id: DialogIds,
  permissions?: Permissions[]
  name: string,
  path: string
} 
export default interface DialogProps extends BluePrintDialogProps, Dialog {} 
