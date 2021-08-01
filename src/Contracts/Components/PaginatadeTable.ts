import {
  ColumnProps as BlueprintColumnProps,
  TableProps,
} from '@blueprintjs/table'
import { AxiosResponse } from 'axios'
import Paginated from '../Models/Paginated'
// import { ReactPaginateProps } from 'react-paginate'

export interface ColumnProps extends BlueprintColumnProps {
  cellRenderer?: (cell: any) => any
  keyName?: string
  formatText?: (
    text: string,
    row?: Record<string, any>
  ) => React.ReactNode
  withoutValueText?: string
}
export interface PaginatedTableProps extends TableProps {
  containerProps?: any
  columns?: (ColumnProps & {})[]
  height?: string
  request: (
    page: number,
    limit: number,
    parPage?: number
  ) => Promise<AxiosResponse<Paginated<any>>>
  onRowSelect?: (row: any) => void
}
