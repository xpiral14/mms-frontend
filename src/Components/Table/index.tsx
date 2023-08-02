import React, { useMemo } from 'react'
import { Column, TableProps } from '../../Contracts/Components/Table'
import Render from '../Render'

const Table = function<T = any>(props: TableProps<T>) {
  const getWithoutValueDefaultText = (column: Column) => {
    return column.withoutValueText || '-'
  }

  const getColumnText = (column: Column, row?: Record<string, any>) => {
    const text = row?.[column.keyName!]
    if (column.keyName && !row?.[column.keyName!]) {
      return getWithoutValueDefaultText(column)
    }
    return column?.formatText?.(row) ?? text
  }

  const defaultCellRenderer = (column: Column, row: Record<any, any>) => (
    <div>{getColumnText(column, row)}</div>
  )

  const footer = useMemo(
    () => props.renderFooter?.(props.columns, props.rows),
    [props.columns, props.rows]
  )
  return (
    <table className='w-100 bp4-html-table bp4-html-table-bordered bp4-html-table-striped bp4-interactive'>
      <thead>
        <tr>
          {props.columns?.map((column) => (
            <th key={column.keyName} style={column.style}>{column.name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows?.map((row) => (
          <tr
            key={props.rowKey?.(row) || row?.id as any}
            className={props?.isSelected?.(row) ? 'active' : ''}
          >
            {props.columns?.map((column) => (
              <td key={column.keyName} onClick={() => props.onRowSelect?.(row)}>
                {(column?.cellRenderer ?? defaultCellRenderer)(column, row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <Render renderIf={Boolean(props.renderFooter)}>{footer}</Render>
    </table>
  )
}

export default Table
