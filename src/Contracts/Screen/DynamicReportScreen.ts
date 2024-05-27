import { PaginatedTableProps } from '../Components/PaginatadeTable'

interface ChartProp<T = any> {
  type: 'Bar' | 'Pie'
  dataKey: keyof T
  nameDataKey: keyof T
  yUnit?: string
}
export interface DynamicReportProps<T = any> extends PaginatedTableProps<T> {
  charts?: ChartProp<T>[]
}
export type DynamicReportScreenProps<T = any> = Omit<DynamicReportProps<T>, 'isSelected' | 'onRowSelect' | 'containerProps' | 'height'>
