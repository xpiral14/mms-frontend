import { ResponseType } from 'axios'

export type FilterType = Record<string, string | number>
export  type ReportType = 'pdf' | 'csv'
export type ReportRequestOption = {
  reportType: ReportType,
  name?: string
  responseType?: ResponseType
  mimeType: string
}
