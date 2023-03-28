import { Permissions } from '../Constants/Enums'
import { Dialogs } from '../Contracts/Hooks/useDialog'

export default {
  'product-stock-warn': {
    id: 'product-stock-warn',
    permissions: [Permissions.READ_STOCK],
    name: 'Alerta de estoque de produto',
    path: 'ProductStockWarn'
  }
} as Dialogs
