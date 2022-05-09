import { SubScreenProps } from '../../Components/ScreenProps'
import Cost from '../../Models/Cost'

export interface CostPostProps {
  cost?: Partial<Cost>
} 

export interface CostPostScreenProps extends SubScreenProps, CostPostProps {
  
}
