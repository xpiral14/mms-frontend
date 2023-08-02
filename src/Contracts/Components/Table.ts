import { CSSProperties } from 'react'

export type Column = {
  cellRenderer?: (column: Column, row: Row) => React.ReactNode
  keyName?: string
  formatText?: (row?: Row) => React.ReactNode
  withoutValueText?: React.ReactNode
  name?: React.ReactNode
  style?: CSSProperties
}

export type Row<T = any> = T & any

export type TableProps<T = any> = {
  height?: string
  isSelected?: (row: Row<T>) => boolean
  onRowSelect?: (row: Row<T>) => void
  rowKey?: (row: Row<T>) => string
  renderFooter?: (columns: Column[], rows:Row<T>[]) => React.ReactElement
  columns: Column[]
  rows: Row<T>[]
}
