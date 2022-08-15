import { Permissions } from '../Constants/Enums'
import { Dialogs } from '../Contracts/Hooks/useDialog'

export default {
  'part-stock-warn': {
    id: 'part-stock-warn',
    permissions: [Permissions.READ_STOCK],
    name: 'Alerta de estoque de produto',
    path: 'PartStockWarn'
  }
} as Dialogs
