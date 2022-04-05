import Order from '../../Models/Order'
import OrderServiceModel from '../../Models/OrderService'
import ScreenProps, {Screen} from '../../Components/ScreenProps'

export type OrderServiceItem = Partial<OrderServiceModel & {
  isCollapsed?: boolean,
  isEditMode?: boolean,
  service_name?: string,
  service_id?: number,
  service_price?: number,
  service_unit_id?: number,
  service_unit_name?: string
}>;

export interface OrderServiceDetailsProps {
  order?: Partial<Order>
  onSave?: (orderServices: OrderServiceModel[], screen: Screen) => Promise<void> | void
}

export interface OrderServiceDetailScreenProps extends ScreenProps, OrderServiceDetailsProps {
}
