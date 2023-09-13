import React, { useCallback, useState } from 'react'
import TableSelect, { TableSelectProps } from '../TableSelect'
import { AxiosResponse } from 'axios'
import Paginated from '../../Contracts/Models/Paginated'
import useAsync from '../../Hooks/useAsync'
import { Filters } from '../../Contracts/Components/Table'
import useMessageError from '../../Hooks/useMessageError'
import { Footer, PaginateContainer } from './styles'
import { Card } from '@blueprintjs/core'
import { CSSProperties } from 'styled-components'
import Render from '../Render'
import Button from '../Button'

interface AsyncTableSelectProps<T> extends Omit<TableSelectProps<T>, 'rows'> {
  request?: (
    page: number | any,
    limit: number,
    filters?: Filters
  ) => Promise<AxiosResponse<Paginated<T>>>
}
const cardStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  alignItems: 'center',
  padding: '5px',
}

interface TableFooterProps<T> {
  colSpan: number
  gridResponse?: Paginated<T>
  selectedFilters: Filters
  loading: boolean
  onCleanFilters: () => void
  onReloadTable: () => void
}
function TableFooter<T = any>({
  colSpan,
  gridResponse,
  selectedFilters,
  loading,
  onCleanFilters,
  onReloadTable,
}: TableFooterProps<T>) {
  return (
    <Footer>
      <td colSpan={colSpan}>
        <Card style={cardStyle}>
          <div>
            Mostrando {gridResponse?.data.length} de {gridResponse?.meta.total}
          </div>
          <PaginateContainer>
            <Render renderIf={Boolean(Object.keys(selectedFilters).length)}>
              <Button
                help='Limpar filtros'
                icon='clean'
                loading={loading}
                onClick={onCleanFilters}
              />
            </Render>
            <Button icon='reset' loading={loading} onClick={onReloadTable} />
          </PaginateContainer>
        </Card>
      </td>
    </Footer>
  )
}
function AsyncTableSelect<T = any>({
  request,
  ...tableSelectProps
}: AsyncTableSelectProps<T>) {
  const [response, setResponse] = useState<Paginated<T> | undefined>()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [filters, setFilters] = useState({} as Filters)
  const { showErrorMessage } = useMessageError()
  const [loading, reload] = useAsync(async () => {
    if (!isPopoverOpen) return
    try {
      const response = await request?.(1, 20, filters)
      setResponse(response?.data)
    } catch (error) {
      showErrorMessage(error, 'Não foi possível obter os dados')
    }
  }, [request, filters, isPopoverOpen])
  const renderFooterFunction = useCallback(
    () => (
      <TableFooter<T>
        colSpan={tableSelectProps.columns.length}
        gridResponse={response}
        loading={loading}
        onCleanFilters={() => setFilters({})}
        onReloadTable={reload}
        selectedFilters={filters}
      />
    ),
    [tableSelectProps.columns.length, response, loading, reload, filters]
  )
  return (
    <TableSelect<T>
      rows={(response?.data as any) ?? []}
      onFilter={setFilters}
      onPopoverClose={() => setIsPopoverOpen(false)}
      onPopoverOpen={() => setIsPopoverOpen(true)}
      isPopoverOpen={isPopoverOpen}
      loading={loading}
      filter={filters}
      renderFooter={renderFooterFunction}
      {...tableSelectProps}
    />
  )
}

export default AsyncTableSelect
