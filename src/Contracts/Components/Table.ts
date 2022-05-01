import { CSSProperties } from 'react'

export type Column = {
  cellRenderer?: (cell: any) => React.ReactNode
  keyName?: string
  formatText?: (row?: Row) => React.ReactNode
  withoutValueText?: React.ReactNode
  name?: React.ReactNode
  style?: CSSProperties
}

export type Row = Record<string, string | number | undefined>

export type TableProps = {
  height?: string
  isSelected?: (row: Row) => boolean
  onRowSelect?: (row: Row) => void
  rowKey?: (row: Row) => string
  renderFooter?: (columns: Column[], rows:Row[]) => React.ReactElement
  columns: Column[]
  rows: Row[]
}
