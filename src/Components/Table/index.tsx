import React, { useMemo } from 'react'
import { Column, Row, TableProps } from '../../Contracts/Components/Table'
import Render from '../Render'
import Button from '../Button'
import { Popover2 } from '@blueprintjs/popover2'
import Filter from './Filter'
import { Colors, Icon } from '@blueprintjs/core'

const Table = function <T = any>(props: TableProps<T>) {
  const getWithoutValueDefaultText = (column: Column<T>) => {
    return column.withoutValueText || '-'
  }

  const getColumnText = (column: Column<T>, row?: Row<T>) => {
    const text = row?.[column.keyName!]
    if (column.keyName && !row?.[column.keyName!]) {
      return getWithoutValueDefaultText(column)
    }
    return column?.formatText?.(row) ?? text
  }

  const defaultCellRenderer = (column: Column<T>, row: Row<T>) => (
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
            <th key={column.keyName as string} style={column.style}>
              <div
                className='d-flex justify-content-between align-items-center'
                style={{ height: 30 }}
              >
                <span>{column.name}</span>
                <Render renderIf={Boolean(column.filters?.length)}>
                  <Popover2
                    content={
                      <Filter<T>
                        column={column}
                        onFilter={props.onFilter}
                        filter={props.filter ?? {}}
                      />
                    }
                  >
                    <Button
                      help='Aplicar filtros'
                      icon={
                        <Icon
                          icon='filter'
                          color={
                            Object.keys(props.filter ?? {}).some(
                              (k) =>
                                column.keyName && k.startsWith(column.keyName)
                            )
                              ? Colors.BLUE3
                              : undefined
                          }
                        />
                      }
                      minimal
                    />
                  </Popover2>
                </Render>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.rows?.map((row) => (
          <tr
            key={props.rowKey?.(row) || (row?.id as any)}
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
