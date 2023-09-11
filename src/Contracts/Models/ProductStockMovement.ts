export default interface ProductStockMovement {
  id: number;
  quantity: number;
  action: string;
  action_name: string
  type: string
  type_name: string
  created_at: string
}
