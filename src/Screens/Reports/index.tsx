import React from 'react'
import Button from '../../Components/Button'
import PaginatedTable from '../../Components/PaginatedTable'
import ReportService from '../../Services/ReportService'
import FileService from '../../Services/FileService'

const Reports = () => {

  const downloadReport = (reportUuid: string) => () => FileService.downloadFile(reportUuid)
  return (
    <PaginatedTable
      height='100%'
      request={ReportService.getAll}
      columns={[
        {
          style: {
            width: '20%'
          },
          name: 'Data de emissão',
          formatText: (r) =>
            r?.created_at ? new Date(r?.created_at)?.toLocaleDateString(undefined, {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }): '-',
        },
        {
          style: {
            width: '60%'
          },
          name: 'Nome',
          formatText: (r) => r?.name ?? r?.category,
        },
        {
          style: {
            width: '10%'
          },
          name: 'Status',
          formatText: (r) => r?.status,
        },
        {
          style: {
            width: '10%'
          },
          name: '',
          cellRenderer: (_, r) => {
            if (r.status !== 'available') {
              return <></>
            }
            return <div style={{textAlign: 'center', width: '100%'}}>
              <Button
                icon="download"
                onClick={r?.uuid ? downloadReport(r?.uuid as string) : undefined}>
              </Button>
            </div>
          }
        },
      ]}
      containerProps={{
        style: {
          flex: 1,
        },
      }}
    />
  )
}

export default Reports
