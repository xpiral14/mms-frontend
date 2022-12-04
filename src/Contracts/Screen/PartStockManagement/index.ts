import ScreenProps from '../../Components/ScreenProps'
import Stock from '../../Models/Stock'

export interface PartStockProps {
  stock: Partial<Stock>
}

export default interface PartStockScreenProps
  extends PartStockProps,
    ScreenProps {}
