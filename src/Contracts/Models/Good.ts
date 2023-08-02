import GoodProduct from './GoodProduct'

export enum GoodStatuses {
  DISTRIBUTED = 'DISTRIBUTED',
  NOT_DISTRIBUTED = 'NOT_DISTRIBUTED',
  PARTIAL_DISTRIBUTED = 'PARTIAL_DISTRIBUTED'
}

export const GoodStatusesNames = {
  [GoodStatuses.DISTRIBUTED]: 'Distribuído',
  [GoodStatuses.NOT_DISTRIBUTED]: 'Não distribuído',
  [GoodStatuses.PARTIAL_DISTRIBUTED]: 'Parcialmente distribuído',
}
export default interface Good {
  id?: number;
  invoice_number: string
  supplier_id: number
  received_at: string|Date
  distributed_at: string|Date|null
  requested_at?: string | Date
  goods_products: GoodProduct[]
  status: GoodStatuses
}
