import React, { useCallback, useMemo, useRef } from 'react'
import { Column, Row, Sort, TableProps } from '../../Contracts/Components/Table'
import Render from '../Render'
import Button from '../Button'
import { Popover2 } from '@blueprintjs/popover2'
import Filter from './Filter'
import { ButtonGroup, Colors, Icon } from '@blueprintjs/core'
import { StyledTable } from './styles'
import LoadingBackdrop from '../Layout/LoadingBackdrop'
import joinClasses from '../../Util/joinClasses'
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from 'react-icons/md'
import { AiOutlineMinus } from 'react-icons/ai'

const sortMachineState = {
  asc: 'desc',
  desc: 'none',
  none: 'asc',
} as Record<Sort, Sort>

const Table = function <T = any>(props: TableProps<T>) {

  const getWithoutValueDefaultText = (column: Column<T>) => {
    return column.withoutValueText || '-'
  }

  const onSortClick = useCallback(
    (column: Column<T>) => {
      let currentColumnSort = props.sorts?.[column.keyName as any]
      if (!currentColumnSort) {
        currentColumnSort = 'none'
      }

      props.onSortChange?.(column, sortMachineState[currentColumnSort])
    },
    [props.onSortChange, props.sorts]
  )

  const getColumnText = (
    column: Column<T>,
    row?: Row<T>,
    rowIndex?: number
  ) => {
    return (
      column?.formatText?.(row, rowIndex) ??
      row?.[column.keyName!] ??
      getWithoutValueDefaultText(column)
    )
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
  useRef<HTMLElement>(null)
  return (
    <div>
      <StyledTable
        className={joinClasses({
          'w-full bp5-html-table bp5-html-table-bordered position-relative':
            true,
          'bp5-html-table-striped': props.stripped,
          'bp5-interactive': props.interactive,
          'select-none': props.allowMultiSelect,
        })}
      >
        <Render renderIf={!props.noHeader}>
          <thead>
            <tr>
              {props.columns?.map((column) => (
                <th
                  key={column.keyName as string}
                  style={
                    typeof column.headerColStyle === 'function'
                      ? column.headerColStyle(column)
                      : column.headerColStyle
                  }
                >
                  <div
                    className='flex items-center justify-between'
                    style={{ height: 30 }}
                  >
                    <span>{column.name}</span>
                    <ButtonGroup>
                      <Render renderIf={column.sortable}>
                        <Render
                          renderIf={
                            props.sorts?.[column.keyName as string] === 'asc'
                          }
                        >
                          <Button
                            icon={<MdOutlineKeyboardArrowDown size={16} />}
                            minimal
                            small
                            help='Ordem crescente (A - Z)'
                            onClick={() => onSortClick(column)}
                          />
                        </Render>
                        <Render
                          renderIf={
                            props.sorts?.[column.keyName as string] === 'desc'
                          }
                        >
                          <Button
                            icon={<MdOutlineKeyboardArrowUp size={16} />}
                            minimal
                            small
                            help='Ordem decrescente (Z - A)'
                            onClick={() => onSortClick(column)}
                          />
                        </Render>
                        <Render
                          renderIf={[undefined, 'none'].includes(
                            props.sorts?.[column.keyName as string]
                          )}
                        >
                          <Button
                            icon={<AiOutlineMinus size={16} />}
                            minimal
                            small
                            help='Sem ordenamento'
                            onClick={() => onSortClick(column)}
                          />
                        </Render>
                      </Render>
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
                                      props.filter?.[k] &&
                                      ((column.keyName &&
                                        k.startsWith(column.keyName)) ||
                                        column.filters?.some(
                                          (filter) =>
                                            filter.keyName &&
                                            k.startsWith(filter.keyName)
                                        ))
                                  )
                                    ? Colors.BLUE3
                                    : undefined
                                }
                              />
                            }
                            minimal
                            small
                          />
                        </Popover2>
                      </Render>
                    </ButtonGroup>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        </Render>
        <tbody>
          {props.rows?.map((row, rowIndex, rows) => (
            <tr
              key={props.rowKey?.(row) || (row?.id as any)}
              className={joinClasses({
                active: props?.isSelected?.(row),
                [typeof props.rowClassNames === 'string'
                  ? props.rowClassNames
                  : props.rowClassNames?.(row) ?? '']: true,
              })}
              style={props.rowStyle?.(row)}
            >
              {props.columns?.map((column) => {
                const onColumnClick = (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
                  function getNearestSelectedRowIndex(currentIndex: number) {
                    let nearestIndex = currentIndex
                    for (let i = currentIndex - 1; i >= 0; i--) {
                      if (!props.isSelected?.(rows[i])) {
                        break
                      }
                      nearestIndex = i
                    }
                    return nearestIndex
                  }

                  if (!props.allowMultiSelect) {
                    return props.onRowSelect?.(row)
                  }

                  if (rowIndex === 0) {
                    props.onRowsSelect?.([row])
                    return
                  }

                  if (!e.shiftKey) return

                  const isRowSelected = props.isSelected?.(row)
                  if (isRowSelected) {
                    const index = getNearestSelectedRowIndex(rowIndex)
                    props.unselectRows?.(rows.slice(index, rowIndex + 1))
                    return
                  }
                  const firstSelectedRow = rows.findIndex(row => props.isSelected?.(row))
                  const allSelectedRows = rows.slice(firstSelectedRow, rowIndex + 1)
                  allSelectedRows.push(...rows.slice(rowIndex, rows.length).filter(props.isSelected!))
                  props.onRowsSelect?.(allSelectedRows)
                }
                return (
                  <td
                    key={column.keyName}
                    onClick={onColumnClick}
                    style={
                      typeof column.style === 'function'
                        ? column.style(row, column)
                        : column.style
                    }
                  >
                    {(column?.cellRenderer ?? defaultCellRenderer)(
                      column,
                      row,
                      rowIndex,
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
          <Render renderIf={!props.loading && !props.rows?.length}>
            <tr>
              <td colSpan={props.columns.length}>
                <div className='flex w-full items-center justify-center gap-3'>
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
          <tfoot>{footer}</tfoot>
        </Render>
      </StyledTable>
      <LoadingBackdrop loading={props.loading} />
    </div>
  )
}

Table.defaultProps = {
  interactive: true,
  stripped: true,
}
export default Table
