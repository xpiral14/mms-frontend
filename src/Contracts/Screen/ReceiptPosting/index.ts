import { SubScreenProps } from '../../Components/ScreenProps'
import Receipt from '../../Models/Receipt'

export interface ReceiptPostProps {
  receipt: Receipt
}

export interface ReceiptPostScreenProps extends SubScreenProps, ReceiptPostProps{}
