import {
  ColumnProps as BlueprintColumnProps,
  TableProps,
} from '@blueprintjs/table'
import { AxiosResponse } from 'axios'
import Paginated from '../Models/Paginated'
// import { ReactPaginateProps } from 'react-paginate'

interface ColumnProps extends BlueprintColumnProps {
  cellRenderer?: (cell: any) => any
}
export interface PaginatedTableProps extends TableProps {
  containerProps?: any
  columns?: (ColumnProps & {
    keyName?: string
    formatText?: (column: string) => React.ReactNode
  })[]
  request: (
    page: number,
    limit: number,
    query?: object
  ) => Promise<AxiosResponse<Paginated<any>>>
  onRowSelect?: (row: any) => void
}
