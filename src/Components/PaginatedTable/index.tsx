import { PaginatedTableProps } from '../../Contracts/Components/PaginatadeTable'
import Paginate, { ReactPaginateProps } from 'react-paginate'

import { Body, Container, Footer, PaginateContainer } from './style'
import { Card, Classes, Icon, Button } from '@blueprintjs/core'
import { useEffect, useMemo, useState } from 'react'
import { useToast } from '../../Hooks/useToast'
import { useGrid } from '../../Hooks/useGrid'
import Select from '../Select'
import { Option } from '../../Contracts/Components/Suggest'
import { CSSProperties } from 'styled-components'
import React from 'react'
import Table from '../Table'
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

const PaginatedTable: React.FC<PaginatedTableProps> = ({
  columns,
  request,
  customRequest,
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
  const [selectedRegions] = useState<{ cols: number[]; rows: number[] }[]>([])
  const { showErrorToast } = useToast()

  useEffect(() => {
    const loadRequestData = async () => {
      try {
        const apiRequest = customRequest ? customRequest : request
        const response = await apiRequest?.(page + 1, limit, rest?.filters || {})
        if(response?.data)
          setGridResponse(response?.data)
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
  }, [reloadGrid, limit, page,  rest?.filters])

  const paginateOptions = useMemo(
    () =>
      ({
        breakLinkClassName: `${Classes.BUTTON} ${
          reloadGrid ? Classes.DISABLED : ''
        }`,
        disabledClassName: Classes.DISABLED,
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
          if (reloadGrid) return
          setPage(selected)
          setReloadGrid(true)
        },
        pageCount: gridResponse?.meta.lastPage || 0,
      } as ReactPaginateProps),
    [gridResponse, reloadGrid]
  )

  useEffect(() => {
    if (selectedRegions.length) {
      rest?.onRowSelect?.(gridResponse?.data[selectedRegions[0].rows[0]])
    }
  }, [selectedRegions])

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
      <Body height={rest?.height}>
        <Table
          rows={gridResponse?.data ?? []}
          columns={columns}
          onRowSelect={rest.onRowSelect}
          isSelected={rest.isSelected}
          rowKey={rest.rowKey}
        />
      </Body>
      {Boolean(gridResponse?.meta) && (
        <Footer>
          <Card style={cardStyle}>
            <div>
              
              Mostrando {gridResponse?.data.length} de {gridResponse?.meta.total}
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
