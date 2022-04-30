import { ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../Components/ScreenProps'
import Employee from '../../Models/Employee'

export interface EmployeeRegisterScreenProps extends ScreenProps {
  defaultEmployee?: Partial<Employee>
  defaultScreenStatus?: ScreenStatus
}
