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
export interface PaginatedTableProps<T = any> extends Omit<TableProps<T>, 'rows'> {
  containerProps?: any
  request?: (
    page: number | any,
    limit: number,
    filters?: Record<string, string | number | undefined>
  ) => Promise<AxiosResponse<Paginated<any>>>
  customRequest?:(
    page: number | any,
    limit: number,
    filters?: Record<string, string | number | undefined>
  ) => Promise<AxiosResponse<Paginated<any>>>
  height?: string
  isSelected?: (row: Row) => boolean
  onRowSelect?: (row: Row) => void
  rowKey?: (row: Row) => string
  filters?:Record<string, string | number | undefined>
}
