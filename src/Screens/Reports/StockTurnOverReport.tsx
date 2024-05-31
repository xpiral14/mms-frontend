import React, { useEffect } from 'react'
import Container from '../../Components/Layout/Container'
import Box from '../../Components/Layout/Box'
import Button from '../../Components/Button'
import { Intent } from '@blueprintjs/core'
import Row from '../../Components/Layout/Row'
import ScreenProps from '../../Contracts/Components/ScreenProps'
import InputNumber from '../../Components/ScreenComponents/InputNumber'
import InputDate from '../../Components/ScreenComponents/InputDate'
import { useWindow } from '../../Hooks/useWindow'
import PaginatedTable from '../../Components/PaginatedTable'
import StockService from '../../Services/StockService'
import Stock from '../../Contracts/Models/Stock'
import { useGrid } from '../../Hooks/useGrid'
import strToNumber from '../../Util/strToNumber'
import { endOfMonth, startOfMonth } from 'date-fns'

interface StockTurnOverReportProps {
  stock: Stock
}

interface StockTurnOverReportScreenProps
  extends StockTurnOverReportProps,
    ScreenProps {}
const StockTurnOverReport = ({
  screen,
  stock,
}: StockTurnOverReportScreenProps) => {
  const { payload, setPayload } = useWindow()
  const { setReloadGrid } = useGrid()
  const onSearch = () => {
    setReloadGrid(true)
  }

  useEffect(() => {
    setPayload({
      start_date_gt: startOfMonth(new Date()),
      end_date_lt: endOfMonth(new Date()),
      coefficient_gt: 1,
    })
  }, [])
  return (
    <Container style={{ height: 'calc(100% - 80px)' }}>
      <Box>
        <div className='flex align-center'>
          <InputNumber
            name='coefficient_gt'
            required
            placeholder='0.0'
            min={0}
            step={0.1}
            label='Coeficiente mínimo'
          />
          <InputDate
            name='start_date_gt'
            required
            id={screen.id + 'start_date'}
            label='Data de início'
          />
          <InputDate
            name='end_date_lt'
            required
            id={screen.id + 'end_date'}
            label='Data de término'
          />
          <Button
            text='Buscar'
            icon='search'
            intent={Intent.PRIMARY}
            onClick={onSearch}
          />
        </div>
      </Box>
      <Row  className='h-full'>
        <PaginatedTable
          hidePaginationAttributes
          height='100%'
          columns={[
            {
              name: 'Referência do produto',
              keyName: 'reference',
              filters: [
                {
                  name: 'Referência do produto',
                  type: 'text',
                  keyName: 'reference',
                },
              ],
            },
            {
              name: 'Produto',
              keyName: 'name',
            },
            {
              name: 'Coeficiente',
              keyName: 'coefficient',
              formatText: (row) => (+row?.coefficient).toFixed(2),
            },
          ]}
          downloadable
          reportRequestOptions={[
            {
              mimeType: 'text/csv',
              reportType: 'csv',
              name: 'CSV',
              responseType: 'text',
            },
          ]}
          customRequest={(page, limit, filters, options) => {
            return StockService.getStockTurnOverReport(
              stock.id,
              {
                ...filters,
                ...{
                  start_date_gt: payload.start_date_gt ?? startOfMonth(new Date()),
                  end_date_lt: payload.end_date_lt ?? endOfMonth(new Date()),
                  coefficient_gt: strToNumber(payload.coefficient_gt ?? 1),
                },
              },
              options
            )
          }}
        />
      </Row>
    </Container>
  )
}

export default StockTurnOverReport
