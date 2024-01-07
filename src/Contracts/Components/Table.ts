import { CSSProperties } from 'react'

export type ColumnFilter<T = Record<string, any>> = {
  type?: 'text' | 'from_date' | 'to_date' | 'date' | 'checkbox' | 'radio' | 'currency'
  name: string,
  value?: string & ({ label: string, value: string }[])
  keyName?: keyof T & string
}
export type Column<T = Record<string, any>> = {
  cellRenderer?: (column: Column<T>, row: Row<T>, rowIndex: number) => React.ReactNode
  keyName?: keyof T & string
  formatText?: (row?: Row<T>, rowIndex?: number) => React.ReactNode
  withoutValueText?: React.ReactNode
  name?: React.ReactNode
  style?: CSSProperties | ((row: Row<T>, col: Column<T>) => CSSProperties)
  headerColStyle?: CSSProperties | ((col: Column<T>) => CSSProperties)
  filters?: ColumnFilter<T>[]
  sortable?: boolean
}

export type Row<T = any> = T & Record<any, any>

export type Filters = Record<string, string>
export type Sort = 'asc' | 'desc' | 'none'
export type Sorts<T = any> = Record<keyof T | string, Sort>

export type TableProps<T = Record<string, any>> = {
  allowMultiSelect?: boolean
  columns: Column<T>[]
  filter?: Filters
  height?: string
  interactive?: boolean
  isSelected?: (row: Row<T>) => boolean
  loading?: boolean
  noHeader?: boolean
  onFilter?: ((filters: Filters) => void) | ((filters: Filters) => Promise<void>)
  onRowSelect?: (row: Row<T>) => void
  onRowsSelect?: (rows: Row<T>[]) => void
  onSortChange?: (column: Column<T>, sort: Sort) => void
  renderFooter?: (columns: Column<T>[], rows: Row<T>[]) => React.ReactElement
  rowClassNames?: ((r: Row<T>) => string | undefined) | string | undefined
  rowKey?: (row: Row<T>) => string | number
  rowStyle?: (r: Row<T>) => CSSProperties
  rows: Row<T>[]
  selectable?: boolean
  sorts?: Sorts<T>
  stripped?: boolean
  unselectRows?: (row: Row<T>[]) => void
}
