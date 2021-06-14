import { ColumnProps as BlueprintColumnProps, TableProps } from '@blueprintjs/table'
import { AxiosResponse } from 'axios'
import Paginated from '../Models/Paginated'
// import { ReactPaginateProps } from 'react-paginate'

interface ColumnProps extends BlueprintColumnProps {
  cellRenderer?: (cell: any) => any
}
export interface PaginatedTableProps extends TableProps {
  columns?: (ColumnProps & {keyName?: string})[]
  request: (page: number, limit: number) => Promise<AxiosResponse<Paginated<any>>>
  onRowSelect?: (row: any) => void
}
