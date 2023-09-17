import { PaginatedTableProps } from '../Components/PaginatadeTable'

export type DynamicReportScreenProps<T = any> = Omit<PaginatedTableProps<T>, 'isSelected'| 'onRowSelect' | 'containerProps' | 'height'>
