import React from 'react'
import { DynamicReportScreenProps } from '../../Contracts/Screen/DynamicReportScreen'
import PaginatedTable from '../../Components/PaginatedTable'

const DynamicReportScreen = (props: DynamicReportScreenProps) => {
  return <PaginatedTable {...props} />
}

export default DynamicReportScreen
