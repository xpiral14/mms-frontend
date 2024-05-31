import { PaginatedTableProps } from '../Components/PaginatadeTable'
import { Column } from '../Components/Table'
import { ScreenIds } from '../Hooks/useScreen'

interface ChartProp<T = any> {
  type: 'Bar' | 'Pie'
  dataKey: keyof T
  nameDataKey: keyof T
  yUnit?: string
}
export interface DynamicReportProps<T = any> extends Omit<PaginatedTableProps<T>, 'columns'> {
  charts?: ChartProp<T>[]
  screen?: ScreenIds,
  screenProps?: any
  columns?: Column<T>[]
}
export type DynamicReportScreenProps<T = any> = Omit<DynamicReportProps<T>, 'isSelected' | 'onRowSelect' | 'containerProps' | 'height'>
