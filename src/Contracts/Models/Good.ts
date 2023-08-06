import GoodProduct from './GoodProduct'

export enum GoodStatuses {
  NOT_RECEIVED = 'NOT_RECEIVED',
  CANCELED = 'CANCELED',
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
  received_at?: string|Date
  distributed_at?: string|Date,
  expected_receipt_date?: string|Date,
  requested_at?: string | Date
  goods_products: GoodProduct[]
  status_name?: string
  is_automatic_request?: boolean
  status: GoodStatuses,
}
