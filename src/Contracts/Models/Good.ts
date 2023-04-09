export default interface Good {
  id?: number;
  supplier_id: number
  received_at: string|Date
  distributed_at: string|Date
}
