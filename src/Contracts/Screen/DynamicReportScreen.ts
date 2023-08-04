import { PaginatedTableProps } from '../Components/PaginatadeTable'

export type DynamicReportScreenProps = Omit<PaginatedTableProps, 'isSelected'| 'onRowSelect' | 'containerProps' | 'height'>
