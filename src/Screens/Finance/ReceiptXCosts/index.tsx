import { useState } from 'react'
import Container from '../../../Components/Layout/Container'
import useAsync from '../../../Hooks/useAsync'
import useMessageError from '../../../Hooks/useMessageError'
import {
  Bar,
  BarChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Colors } from '@blueprintjs/core'
import ChartService from '../../../Services/ChartService'
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns'
import getDateWithTz from '../../../Util/getDateWithTz'
import currencyFormat from '../../../Util/currencyFormat'
import Row from '../../../Components/Layout/Row'
import Box from '../../../Components/Layout/Box'
import Select from '../../../Components/Select'
import ptBR from 'date-fns/locale/pt-BR'
import capitalize from '../../../Util/capitalize'
import { useWindow } from '../../../Hooks/useWindow'
import joinClasses from '../../../Util/joinClasses'

enum GroupType  {
  CURRENT_MONTH = 1,
  PREVIOUS_MONTH = 2

}

type Payload = {
  fromDate: string
  toDate: string
  groupType: number
}
const ReceiptXCosts = () => {
  const [chartData, setChartData] = useState<
    {
      date: string
      cost_value: number
      receipt_value: number
    }[]
  >([])
  const { showErrorMessage: showErrormessage } = useMessageError()

  const { payload, changePayloadAttribute } = useWindow<Payload>()
  const currentMonth = startOfMonth(new Date())
  const [loadingChart] = useAsync(async () => {
    try {
      const requestPayload = {
        groupType: payload.groupType && payload.groupType < 3 ? 3 : 1,
        fromDate: (payload.groupType === GroupType.PREVIOUS_MONTH ? subMonths(currentMonth, 1) : currentMonth).toJSON().slice(0, 10),
        toDate: (payload.groupType === GroupType.PREVIOUS_MONTH ? subDays(currentMonth, 1) : endOfMonth(currentMonth)).toJSON().slice(0, 10),
      }
      const response = await ChartService.getReceiptsXCosts(
        requestPayload.fromDate,
        requestPayload.toDate,
        1
      )
      setChartData(response.data.data)
    } catch (error) {
      showErrormessage(
        error,
        'não foi possível obter as receitas. Por favor, tente novamente.'
      )
    }
  }, [payload.groupType])

  return (
    <Container className='h-100 w-100 d-flex gap-2'>
      <Box className='flex-shrink-1'>
        <Row>
          <Select
            loading={loadingChart}
            label='Selecione o período'
            required
            items={[
              {
                label:
                  'Mês atual ' +
                  `(${capitalize(
                    format(new Date(), 'LLLL', { locale: ptBR })
                  )})`,
                value: GroupType.CURRENT_MONTH,
              },
              {
                label:
                  'Mês passado ' +
                  ` (${capitalize(
                    format(subMonths(new Date(), 1), 'LLLL', { locale: ptBR })
                  )})`,
                value: GroupType.PREVIOUS_MONTH,
              },
            ]}
            onChange={(item) => changePayloadAttribute('groupType', item.value)}
            activeItem={payload.groupType}
          />
        </Row>
      </Box>
      <Box className={joinClasses({'flex-grow-1': true, 'bp4-skeleton': loadingChart}) }>
        <ResponsiveContainer width='100%' height='100%'>
          <BarChart
            width={500}
            height={300}
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis
              dataKey='date'
              tick={({ payload, x, y }) => {
                return (
                  <text x={x} y={y} fill='#666' textAnchor='middle' dy={10}>
                    {payload.value
                      ? getDateWithTz(payload.value).toLocaleDateString()
                      : 'auto'}
                  </text>
                )
              }}
            />
            <YAxis />
            <Tooltip
              content={({ payload }) => {
                const data = payload?.[0]?.payload
                return (
                  <div
                    className='p-2 shadow-sm rounded'
                    style={{ backgroundColor: 'white' }}
                  >
                    <p style={{ borderBottom: '1px solid #0011' }}>
                      {data?.date &&
                        getDateWithTz(data.date).toLocaleDateString()}
                    </p>
                    <p>Custo total: {currencyFormat(data?.cost_value ?? 0)}</p>
                    <p>
                      Receita total: {currencyFormat(data?.receipt_value ?? 0)}
                    </p>
                  </div>
                )
              }}
            />
            <Legend />
            <Bar name='Receitas' dataKey='receipt_value' fill={Colors.BLUE5} />
            <Bar name='Custos' dataKey='cost_value' fill={Colors.RED5} />
            <Line name='Receitas' dataKey='receipt_value' fill={Colors.BLUE5} />
            <Line name='Custos' dataKey='cost_value' fill={Colors.BLUE5} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Container>
  )
}

export default ReceiptXCosts
