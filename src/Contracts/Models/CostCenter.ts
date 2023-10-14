export default interface CostCenter {
  id: number
  parent_id?: number
  name: string
  description?: string
  parent?: CostCenter
}
