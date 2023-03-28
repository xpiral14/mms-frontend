import ScreenProps from '../../Components/ScreenProps'
import Stock from '../../Models/Stock'

export interface ProductStockProps {
  stock: Partial<Stock>
}

export default interface ProductStockScreenProps
  extends ProductStockProps,
    ScreenProps {}
