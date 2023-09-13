import React, { useMemo } from 'react'
import { Column, Row, TableProps } from '../../Contracts/Components/Table'
import Render from '../Render'
import Button from '../Button'
import { Popover2 } from '@blueprintjs/popover2'
import Filter from './Filter'
import { Colors, Icon } from '@blueprintjs/core'
import { StyledTable } from './styles'
import LoadingBackdrop from '../Layout/LoadingBackdrop'
// import LoadingBackdrop from '../Layout/LoadingBackdrop'

const Table = function <T = any>(props: TableProps<T>) {
  const getWithoutValueDefaultText = (column: Column<T>) => {
    return column.withoutValueText || '-'
  }

  const getColumnText = (
    column: Column<T>,
    row?: Row<T>,
    rowIndex?: number
  ) => {
    const text = row?.[column.keyName!]
    return text ?? column?.formatText?.(row, rowIndex) ??  getWithoutValueDefaultText(column)
  }

  const defaultCellRenderer = (
    column: Column<T>,
    row: Row<T>,
    rowIndex: number
  ) => <div>{getColumnText(column, row, rowIndex)}</div>

  const footer = useMemo(
    () => props.renderFooter?.(props.columns, props.rows),
    [props.columns, props.rows, props.renderFooter]
  )
  return (
    <div>
      <StyledTable className='w-100 bp4-html-table bp4-html-table-bordered bp4-html-table-striped bp4-interactive position-relative'>
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
                                  props.filter?.[k] && (column.keyName && k.startsWith(column.keyName)  || column.filters?.some(filter => filter.keyName && k.startsWith(filter.keyName)))
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
          {props.rows?.map((row, rowIndex) => (
            <tr
              key={props.rowKey?.(row) || (row?.id as any)}
              className={props?.isSelected?.(row) ? 'active' : ''}
            >
              {props.columns?.map((column) => (
                <td
                  key={column.keyName}
                  onClick={() => props.onRowSelect?.(row)}
                >
                  {(column?.cellRenderer ?? defaultCellRenderer)(
                    column,
                    row,
                    rowIndex
                  )}
                </td>
              ))}
            </tr>
          ))}
          <Render renderIf={!props.loading && !props.rows?.length}>
            <tr>
              <td colSpan={props.columns.length}>
                <div className='w-100 d-flex justify-content-center align-items-center gap-3'>
                  <Icon icon='zoom-out' size={32} color={Colors.GRAY3} />
                  <span style={{ fontSize: 30, color: Colors.GRAY3 }}>
                    Não há nada aqui
                  </span>
                </div>
              </td>
            </tr>
          </Render>
        </tbody>
        <Render renderIf={Boolean(props.renderFooter)}>
          <tfoot>
            {footer}
          </tfoot>
        </Render>
      </StyledTable>
      <LoadingBackdrop loading={props.loading} />
    </div>
  )
}

export default Table
