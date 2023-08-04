import { CSSProperties } from 'react'

export type ColumnFilter<T = Record<string, any>> = {
  type?: 'text' | 'from_date' | 'to_date' | 'date' | 'checkbox'
  name: string,
  value?: string & ({ label: string, value: string }[])
  keyName?: keyof T & string
}
export type Column<T = Record<string, any>> = {
  cellRenderer?: (column: Column<T>, row: Row<T>) => React.ReactNode
  keyName?: keyof T & string
  formatText?: (row?: Row<T>, rowIndex?: number) => React.ReactNode
  withoutValueText?: React.ReactNode
  name?: React.ReactNode
  style?: CSSProperties
  filters?: ColumnFilter<T>[]
}

export type Row<T = any> = T & Record<any, any>

type Filters = Record<string, string>

export type TableProps<T = Record<string, any>> = {
  height?: string
  isSelected?: (row: Row<T>) => boolean
  onRowSelect?: (row: Row<T>) => void
  rowKey?: (row: Row<T>) => string|number
  renderFooter?: (columns: Column<T>[], rows: Row<T>[]) => React.ReactElement
  columns: Column<T>[]
  rows: Row<T>[]
  onFilter?: ((filters: Filters) => void) | ((filters: Filters) => Promise<void>)
  filter?: Filters
  loading?: boolean
}
