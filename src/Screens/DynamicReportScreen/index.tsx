import React from 'react'
import { DynamicReportScreenProps } from '../../Contracts/Screen/DynamicReportScreen'
import PaginatedTable from '../../Components/PaginatedTable'
import Container from '../../Components/Layout/Container'
import Render from '../../Components/Render'
import Row from '../../Components/Layout/Row'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useGrid } from '../../Hooks/useGrid'
import shadeColor from '../../Util/shadeColor'
import { Colors } from '@blueprintjs/core'
const DynamicReportScreen = ({
  charts,
  ...props
}: DynamicReportScreenProps) => {
  const { gridResponse } = useGrid()
  return (
    <Container>
      <Render renderIf={Boolean(charts?.length)}>
        <Row>
          {charts?.map((chartConfig) => {
            const CustomTooltip = ({ active, payload, label }: any) => {
              if (active && payload && payload.length) {
                return (
                  <div className='bg-white p-3 rounded-sm'>
                    <p className='label'>{`${label} : ${payload[0].value} ${
                      chartConfig.yUnit ?? ''
                    }`}</p>
                  </div>
                )
              }
              return <></>
            }
            switch (chartConfig.type) {
            case 'Bar':
              return (
                <BarChart width={500} height={300} data={gridResponse?.data}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey={chartConfig.nameDataKey as string} />
                  <YAxis dataKey={chartConfig.dataKey as string} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    type='monotone'
                    fill={Colors.BLUE1}
                    dataKey={chartConfig.dataKey as string}
                    stroke='#8884d8'
                  />
                </BarChart>
              )
            case 'Pie':
              return (
                <PieChart width={400} height={400}>
                  <Pie
                    data={gridResponse?.data}
                    labelLine={false}
                    label
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey={chartConfig.dataKey as string}
                  >
                    <Tooltip />
                    {gridResponse?.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={shadeColor(Colors.BLUE1, index * 50)}
                      />
                    ))}
                  </Pie>
                </PieChart>
              )
            }
          })}
        </Row>
      </Render>
      <PaginatedTable {...props} />
    </Container>
  )
}

export default DynamicReportScreen
