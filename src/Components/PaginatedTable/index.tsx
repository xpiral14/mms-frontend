/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginatedTableProps } from '../../Contracts/Components/PaginatadeTable'
import Paginate, { ReactPaginateProps } from 'react-paginate'
import {
  Cell,
  Column,
  ColumnLoadingOption,
  ICellInterval,
  IRegion,
  Table as BluePrintTable,
  TableLoadingOption,
} from '@blueprintjs/table'
import { Body, Container, Footer } from './style'
import { Card, Classes, Icon } from '@blueprintjs/core'
import { Select } from '@blueprintjs/select'
import { useEffect, useState } from 'react'
import Paginated from '../../Contracts/Models/Paginated'
import { useToast } from '../../Hooks/useToast'

const LimitSelect = Select.ofType<number>()
const PaginatedTable: React.FC<PaginatedTableProps> = ({
  columns,
  request,
  ...rest
}) => {
  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)
  const [selectedRegions, setselectedRegions] = useState<{cols: number[], rows: number[]}[]>([])
  const [response, setResponse] = useState<Paginated<any> | null>(null)
  const { showErrorToast } = useToast()
  const loadRequestData = async () => {
    try {
      const response = await request(page + 1, limit)
      setResponse(response.data)
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter dados',
      })
    }
  }

  useEffect(() => {
    if (page !== null) {
      loadRequestData()
    }
  }, [page])

  const defaultCellRenderer = (key?: string) => (rowIndex: number) =>
    (
      <Cell style={{ width: '100%' }}>
        {key ? response?.data?.[rowIndex]?.[key] || 'Sem valor' : 'Sem valor'}
      </Cell>
    )

  const cellRender = (callback: any) => (rowIndex: number) =>
    callback(response?.data?.[rowIndex])

  const paginateOptions = {
    marginPagesDisplayed: 1,
    containerClassName: 'flex',
    nextLinkClassName: Classes.BUTTON,
    previousLinkClassName: Classes.BUTTON,
    activeLinkClassName: Classes.INTENT_PRIMARY,

    previousLabel: <Icon icon='arrow-left' />,
    nextLabel: <Icon icon='arrow-right' />,
    pageLinkClassName: Classes.BUTTON,
    initialPage: page,
    onPageChange: ({ selected }) => {
      setPage(selected)
    },
    pageCount: response?.meta.last_page || 0,
  } as ReactPaginateProps

  useEffect(() => {
    if(selectedRegions.length){
      rest?.onRowSelect?.(response?.data[selectedRegions[0].rows[0]])
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
            : defaultCellRenderer(column.keyName)
        }
      />
    ))

  return (
    <Container>
      <Body>
        <BluePrintTable
          selectedRegions={selectedRegions as IRegion[]}
          onSelection={(s) => {
            setselectedRegions([
              {
                cols: [0, (columns?.length || 1) - 1],
                rows: s[0].rows as ICellInterval,
              },
            ])
          }}
          numRows={response?.data?.length}
          {...rest}
        >
          {renderColumns()}
        </BluePrintTable>
      </Body>
      {Boolean(response?.meta) && (
        <Footer>
          <Card
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
              padding: '5px',
            }}
          >
            <div>
              Mostrando {response?.data.length} de {response?.meta.total}
              <LimitSelect
                itemRenderer={(item, itemProps) => (
                  <div {...(itemProps as any)}>{item}</div>
                )}
                items={[1, 2, 3, 4]}
                onItemSelect={setLimit}
              />
            </div>
            <div>
              <Paginate {...paginateOptions} />
            </div>
          </Card>
        </Footer>
      )}
    </Container>
  )
}

export default PaginatedTable
