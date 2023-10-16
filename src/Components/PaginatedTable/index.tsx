import { PaginatedTableProps } from '../../Contracts/Components/PaginatadeTable'
import Paginate, { ReactPaginateProps } from 'react-paginate'

import { Body, Container, Footer, PaginateContainer } from './style'
import { Card, Classes, Icon, Menu, MenuItem } from '@blueprintjs/core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useToast } from '../../Hooks/useToast'
import { useGrid } from '../../Hooks/useGrid'
import Select from '../Select'
import { Option } from '../../Contracts/Components/Suggest'
import { CSSProperties } from 'styled-components'
import React from 'react'
import Table from '../Table'
import Render from '../Render'
import DownloadService from '../../Services/DownloadService'
import { uniqueId } from '@blueprintjs/core/lib/esm/common/utils'
import { Popover2, Popover2InteractionKind } from '@blueprintjs/popover2'
import { ReportRequestOption } from '../../Contracts/Types/Api'
import Button from '../Button'
import { Column, Sort } from '../../Contracts/Components/Table'
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

const defaultRequestOptions = [
  {
    reportType: 'csv',
    name: 'Mercadorias do fornecedor',
    responseType: 'text',
    mimeType: 'text/csv',
  },
] as ReportRequestOption[]
const PaginatedTable = function <T = any>({
  columns,
  request,
  customRequest,
  downloadable,
  reportRequestOptions = defaultRequestOptions,
  filter,
  ...rest
}: PaginatedTableProps<T>) {
  const {
    reloadGrid,
    setReloadGrid,
    page,
    setPage,
    limit,
    setLimit,
    setGridResponse,
    gridResponse,
    sorts,
    setSorts,
  } = useGrid()
  const [selectedRegions] = useState<{ cols: number[]; rows: number[] }[]>([])
  const [selectedFilters, setSelectedFilters] = useState(
    filter ?? ({} as Record<string, string>)
  )

  const requestParams = useMemo(() => {
    const formattedSortedParams = Object.entries(sorts).reduce(
      (sortRequest, [columnKey, sortType]) => {
        if (sortType === 'none') return sortRequest
        sortRequest[columnKey + '_orderby'] = sortType
        return sortRequest
      },
      {} as Record<string, string>
    )
    return {
      ...selectedFilters,
      ...formattedSortedParams,
    }
  }, [selectedFilters, sorts])
  const [loadingReport, setLoadingReport] = useState(false)
  const { showErrorToast } = useToast()
  const apiRequest = customRequest ? customRequest : request
  useEffect(() => {
    const loadRequestData = async () => {
      try {
        const response = await apiRequest?.(
          page + 1,
          limit,
          requestParams ?? {}
        )
        if (response?.data) setGridResponse(response?.data)
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
  }, [reloadGrid, limit, page, rest?.filters, requestParams])

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
  const handleDownloadClick = (reportType: ReportRequestOption) => async () => {
    setLoadingReport(true)
    try {
      const response = await apiRequest?.(
        page,
        limit,
        requestParams,
        reportType
      )
      const contentDisposition = response?.headers['Content-Disposition']
      const match = contentDisposition?.match(/filename=([^;]+)/)

      let fileName = 'Relatorio'
      if (match) {
        fileName = match[1]
      }
      DownloadService.download(
        response,
        uniqueId(reportType.name ?? fileName) + `.${reportType.reportType}`,
        {
          mimeType: reportType.mimeType,
        }
      )
    } catch (error) {
      showErrorToast('não foi possível baixar o relatório')
    } finally {
      setLoadingReport(false)
    }
  }
  const onFilter = useCallback((filter: { [x: string]: string }): void => {
    setSelectedFilters(filter)
    setReloadGrid(true)
  }, [])
  const onSortChange = useCallback((c: Column<T>, sort: Sort): void => {
    setSorts((prev) => ({ ...prev, [c.keyName as string]: sort }))
    setReloadGrid(true)
  }, [])
  return (
    <Container style={{ width: '100%' }} {...rest?.containerProps}>
      <Body height={rest?.height}>
        <Table
          rows={gridResponse?.data ?? []}
          columns={columns}
          onRowSelect={rest.onRowSelect}
          isSelected={rest.isSelected}
          rowKey={rest.rowKey}
          onFilter={onFilter}
          filter={selectedFilters}
          loading={reloadGrid}
          rowStyle={rest.rowStyle}
          rowClassNames={rest.rowClassNames}
          sorts={sorts}
          onSortChange={onSortChange}
          {...rest}
        />
      </Body>
      {Boolean(gridResponse?.meta) && (
        <Footer>
          <Card style={cardStyle}>
            <div>
              Mostrando {gridResponse?.data.length} de{' '}
              {gridResponse?.meta.total}
            </div>

            <PaginateContainer>
              <Render
                renderIf={
                  Boolean(Object.keys(selectedFilters).length) ||
                  Object.keys(sorts).length > 0
                }
              >
                <Button
                  help='Limpar filtros e ordenamentos'
                  icon='clean'
                  loading={reloadGrid}
                  onClick={() => {
                    setSelectedFilters({})
                    setSorts({})
                    setReloadGrid(true)
                  }}
                />
              </Render>
              <Render
                renderIf={downloadable && reportRequestOptions.length > 1}
              >
                <Popover2
                  interactionKind={Popover2InteractionKind.HOVER}
                  placement='bottom'
                  content={
                    <Menu>
                      {reportRequestOptions?.map((option) => (
                        <MenuItem
                          key={option.reportType}
                          onClick={handleDownloadClick(option)}
                          text={`Obter relatório ${option.reportType}`}
                        />
                      ))}
                    </Menu>
                  }
                >
                  <Button icon='download' loading={loadingReport} />
                </Popover2>
              </Render>
              <Render
                renderIf={downloadable && reportRequestOptions.length === 1}
              >
                <Button
                  help={`Obter relatório ${reportRequestOptions[0].reportType}`}
                  icon='download'
                  loading={loadingReport}
                  onClick={handleDownloadClick(reportRequestOptions[0])}
                />
              </Render>
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
                  filterable={false}
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
export default PaginatedTable
