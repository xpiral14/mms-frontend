import ScreenProps from '../../Components/ScreenProps'
import GoodProduct from '../../Models/GoodProduct'

export interface AddProductToGoodProps {
  editMode?: boolean
  goodProduct?: Partial<GoodProduct> | null
  onAddProduct: (
    goodProduct: Omit<Partial<GoodProduct>, 'good_id'>,
    closeModal: () => void
  ) => void
} 
export interface AddProductToGoodScreenProps extends ScreenProps, AddProductToGoodProps {
}
