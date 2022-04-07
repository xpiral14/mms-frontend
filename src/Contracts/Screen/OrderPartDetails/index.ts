
import Order from '../../Models/Order'
import OrderPartModel from '../../Models/OrderPart'
import ScreenProps, {Screen} from '../../Components/ScreenProps'


export type OrderPartItem = Partial<OrderPartModel & {
  isCollapsed?: boolean,
  isEditMode?: boolean,
  part_name?: string,
  part_id?: number,
  part_price?: number,
  part_unit_id?: number,
  part_unit_name?: string
}>;

export interface OrderPartDetailsProps {
  order?: Partial<Order>
  onSave?: (orderParts: OrderPartModel[], screen: Screen) => Promise<void> | void,
  selectedOrderParts?: OrderPartModel[]
}

export interface OrderPartDetailsScreenProps extends ScreenProps, OrderPartDetailsProps {
}
