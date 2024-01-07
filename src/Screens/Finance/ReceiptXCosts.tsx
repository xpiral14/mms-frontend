import { useEffect, useState } from 'react'
import Container from '../../Components/Layout/Container'
import useAsync from '../../Hooks/useAsync'
import useMessageError from '../../Hooks/useMessageError'
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
import { Colors, Intent } from '@blueprintjs/core'
import ChartService from '../../Services/ChartService'
import { endOfMonth, format, startOfMonth, subDays, subMonths } from 'date-fns'
import getDateWithTz from '../../Util/getDateWithTz'
import currencyFormat from '../../Util/currencyFormat'
import Row from '../../Components/Layout/Row'
import Box from '../../Components/Layout/Box'
import Select from '../../Components/Select'
import ptBR from 'date-fns/locale/pt-BR'
import capitalize from '../../Util/capitalize'
import { useWindow } from '../../Hooks/useWindow'
import joinClasses from '../../Util/joinClasses'
import InputDate from '../../Components/ScreenComponents/InputDate'
import Button from '../../Components/Button'


type Payload = {
  fromDate: Date
  toDate: Date
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

  const { payload,  setPayload } = useWindow<Payload>()

  useEffect(() => {
    setPayload(({
      fromDate: startOfMonth(new Date()),
      toDate: endOfMonth(new Date()),
      groupType: 3
    }))
  }, [])
  const [loadingChart, reloadChart ] = useAsync(async () => {
    if(!payload.toDate) return
    try {
      const requestPayload = {
        groupType: payload.groupType && payload.groupType < 3 ? 3 : 1,
        fromDate: (payload.fromDate ?? startOfMonth(new Date())).toISOString(),
        toDate: (payload.toDate ?? endOfMonth(new Date())).toISOString()
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
  }, [payload])

  return (
    <Container className="h-full w-full flex flex-column gap-2">
      <Box>
        <Row>
          <InputDate  timePrecision='minute' name="fromDate" id="fromDate" label="Início" />
          <InputDate timePrecision='minute' name="toDate" id="toDate" label="Fim" />
        </Row>
      </Box>
      <Box className='flex-1'>
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
