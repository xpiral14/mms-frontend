import { SubScreenProps } from '../../Components/ScreenProps'
import ProductStock from '../../Models/ProductStock'

export interface ProductStockWarningProps {
  productStock: Partial<ProductStock>
}
export default interface ProductStockWarningScreenProps
  extends ProductStockWarningProps,
    SubScreenProps {}
