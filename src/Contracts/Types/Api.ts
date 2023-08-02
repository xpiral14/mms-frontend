import { ResponseType } from 'axios'

export  type ReportType = 'pdf' | 'csv'
export type ReportRequestOption = {
  reportType: ReportType,
  name?: string
  responseType?: ResponseType
  mimeType: string
}
