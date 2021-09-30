import {
  ColumnProps,
  PaginatedTableProps,
} from '../../Contracts/Components/PaginatadeTable'
import Paginate, { ReactPaginateProps } from 'react-paginate'
import {
  Cell,
  Column,
  ICellInterval,
  IRegion,
  SelectionModes,
  Table as BluePrintTable,
  TableLoadingOption,
} from '@blueprintjs/table'

import { Body, Container, Footer, PaginateContainer } from './style'
import { Card, Classes, Icon, Button } from '@blueprintjs/core'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../../Hooks/useToast'
import { useGrid } from '../../Hooks/useGrid'
import Select from '../Select'
import { Option } from '../../Contracts/Components/Suggest'
import { CSSProperties } from 'styled-components'
import React from 'react'

const pageOptions: Option[] = [
  {
    label: '5',
    value: 5,
  },
  {
    label: '10',
    value: 10,
  },
  {
    label: '20',
    value: 20,
  },
  {
    label: '50',
    value: 50,
  },
  {
    label: '100',
    value: 100,
  },
]

const loadingOptions = [
  TableLoadingOption.CELLS,
  TableLoadingOption.ROW_HEADERS,
]
const PaginatedTable: React.FC<PaginatedTableProps> = ({
  columns,
  request,
  ...rest
}) => {
  const {
    reloadGrid,
    setReloadGrid,
    page,
    setPage,
    limit,
    setLimit,
    setGridResponse,
    gridResponse,
  } = useGrid()
  const [selectedRegions, setselectedRegions] = useState<
    { cols: number[]; rows: number[] }[]
  >([])
  const { showErrorToast } = useToast()

  useEffect(() => {
    const loadRequestData = async () => {
      try {
        const response = await request(page + 1, limit)
        setGridResponse(response.data)
      } catch (error) {
        showErrorToast({
          message: 'Erro ao obter dados',
        })
      } finally {
        setReloadGrid(false)
      }
    }
    if (reloadGrid && limit) {
      loadRequestData()
    }
  }, [reloadGrid, limit, page])

  const getWithoutValueDefaultText = (column: ColumnProps) => {
    return column.withoutValueText || '-'
  }

  const getColumnText = (text: string, column: ColumnProps, row?: object) => {
    if (column.keyName && !text) {
      return getWithoutValueDefaultText(column)
    }
    return column?.formatText?.(text, row) || text
  }
  const defaultCellRenderer =
    (column: ColumnProps, key: string) => (rowIndex: number) =>
      (
        <Cell style={{ width: '100%' }}>
          {getColumnText(
            gridResponse?.data?.[rowIndex]?.[key],
            column,
            gridResponse?.data?.[rowIndex]
          )}
        </Cell>
      )

  const cellRender = (callback: any) => (rowIndex: number) =>
    callback(gridResponse?.data?.[rowIndex])

  const paginateOptions = useMemo(
    () =>
      ({
        marginPagesDisplayed: 1,
        containerClassName: 'flex',
        nextLinkClassName: `${Classes.BUTTON} ${
          reloadGrid ? Classes.DISABLED : ''
        }`,
        previousLinkClassName: `${Classes.BUTTON} ${
          reloadGrid ? Classes.DISABLED : ''
        }`,
        activeLinkClassName: `${
          reloadGrid ? Classes.DISABLED : Classes.INTENT_PRIMARY
        }`,

        previousLabel: <Icon icon='arrow-left' />,
        nextLabel: <Icon icon='arrow-right' />,
        pageLinkClassName: `${Classes.BUTTON} ${
          reloadGrid ? `${Classes.BUTTON} ${Classes.DISABLED}` : ''
        }`,
        initialPage: page,
        onPageChange: ({ selected }) => {
          setPage(selected)
          setReloadGrid(true)
        },
        pageCount: gridResponse?.meta.last_page || 0,
      } as ReactPaginateProps),
    [gridResponse, reloadGrid]
  )

  useEffect(() => {
    if (selectedRegions.length) {
      rest?.onRowSelect?.(gridResponse?.data[selectedRegions[0].rows[0]])
    }
  }, [selectedRegions])

  const renderColumns = () =>
    columns?.map((column) => (
      <Column
        key={column.id}
        {...column}
        cellRenderer={
          column.cellRenderer
            ? cellRender(column.cellRenderer)
            : defaultCellRenderer(column, column.keyName || '')
        }
      />
    ))
  const handleSelectRow = (s: any) => {
    if (!s.length) return
    setselectedRegions([
      {
        cols: [0, (columns?.length || 1) - 1],
        rows: s[0].rows as ICellInterval,
      },
    ])
  }

  const cardStyle: CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
    padding: '5px',
  }

  const handleButtonReloadGridClick = () => setReloadGrid(true)

  const handlePageSelectChange = (option: Option) => {
    setReloadGrid(true)
    setLimit(option.value as number)
  }

  return (
    <Container style={{ width: '100%' }} {...rest?.containerProps}>
      <Body height={rest.height}>
        <BluePrintTable
          loadingOptions={reloadGrid ? loadingOptions : undefined}
          selectionModes={SelectionModes.ROWS_AND_CELLS}
          selectedRegions={selectedRegions as IRegion[]}
          onSelection={handleSelectRow}
          numRows={gridResponse?.data?.length}
          {...rest}
        >
          {renderColumns()}
        </BluePrintTable>
      </Body>
      {Boolean(gridResponse?.meta) && (
        <Footer>
          <Card style={cardStyle}>
            <div>
              Mostrando {gridResponse?.data.length} de
              {gridResponse?.meta.total}
            </div>

            <PaginateContainer>
              <Button
                icon='reset'
                loading={reloadGrid}
                onClick={handleButtonReloadGridClick}
              />
              <div>
                <Select
                  activeItem={limit}
                  items={pageOptions}
                  onChange={handlePageSelectChange}
                />
              </div>
              <div>
                <Paginate {...paginateOptions} />
              </div>
            </PaginateContainer>
          </Card>
        </Footer>
      )}
    </Container>
  )
}

export default React.memo(PaginatedTable)
