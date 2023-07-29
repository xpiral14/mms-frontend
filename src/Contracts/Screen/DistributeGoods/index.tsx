import Good from '../../Models/Good'
import ScreenProps from '../../Components/ScreenProps'

export interface DistributeGoodsProps {
  good: Partial<Good>
}

export default interface GoodRegisterScreenProps extends ScreenProps, DistributeGoodsProps {
}
