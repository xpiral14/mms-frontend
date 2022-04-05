export default interface OrderService {
  id: number,
  order_id: number,
  service_id: number,
  quantity: number,
  description?: string,
  replaced_price: number
}
