import { SubScreenProps } from '../../Components/ScreenProps'
import PartStock from '../../Models/PartStock'

export interface PartStockWarningProps {
  partStock: Partial<PartStock>
}
export default interface PartStockWarningScreenProps
  extends PartStockWarningProps,
    SubScreenProps {}
