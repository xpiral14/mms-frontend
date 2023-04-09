import ScreenProps from '../../Components/ScreenProps'
import GoodProduct from '../../Models/GoodProduct'

export interface AddProductToGoodProps{
  onAddProduct: (goodProduct: Omit<Partial<GoodProduct>, 'good_id'>) => void
} 
export interface AddProductToGoodScreenProps extends ScreenProps, AddProductToGoodProps {
}
