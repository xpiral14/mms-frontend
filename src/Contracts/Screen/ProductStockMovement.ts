import { SubScreenProps } from '../Components/ScreenProps'
import ProductStock from '../Models/ProductStock'

export interface ProductStockMovementProps { 
  productStock: Partial<ProductStock>
}

export interface ProductStockMovementScreenProps extends SubScreenProps, ProductStockMovementProps { }
