import { ColumnProps as BlueprintColumnProps } from '@blueprintjs/table'
import { AxiosResponse } from 'axios'
import Paginated from '../Models/Paginated'
import { TableProps } from './Table'
// import { ReactPaginateProps } from 'react-paginate'

export type Row = Record<string, any>
export interface ColumnProps extends BlueprintColumnProps {
  cellRenderer?: (cell: any) => any
  keyName?: string
  formatText?: (text: string, row?: Row) => React.ReactNode
  withoutValueText?: string
}
export interface PaginatedTableProps extends Omit<TableProps, 'rows'> {
  containerProps?: any
  request: (
    page: number,
    limit: number,
    parPage?: number
  ) => Promise<AxiosResponse<Paginated<any>>>
  height?: string
  isSelected?: (row: Row) => boolean
  onRowSelect?: (row: Row) => void
  rowKey?: (row: Row) => string
}
