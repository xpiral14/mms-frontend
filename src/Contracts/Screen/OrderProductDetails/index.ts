
import Order from '../../Models/Order'
import OrderProductModel from '../../Models/OrderProduct'
import ScreenProps, {Screen} from '../../Components/ScreenProps'


export type OrderProductItem = Partial<OrderProductModel & {
  isCollapsed?: boolean,
  isEditMode?: boolean,
  unique_key?: string,
  product_name?: string,
  product_id?: number,
  product_stock_id?:number
  product_price?: number,
  product_unit_id?: number,
  product_unit_name?: string
}>;

export interface OrderProductDetailsProps {
  order?: Partial<Order>
  onSave?: (orderProducts: OrderProductModel[], screen: Screen) => Promise<void> | void,
  selectedOrderProducts?: OrderProductModel[]
}

export interface OrderProductDetailsScreenProps extends ScreenProps, OrderProductDetailsProps {
}
