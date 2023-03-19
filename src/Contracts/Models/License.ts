import { differenceInDays } from 'date-fns'

export type LicenseType = {
  id: number
  company_id: number
  from_date: Date
  to_date: Date
}

export default class License {
  public readonly id: number
  public readonly company_id: number
  public readonly from_date: Date
  public readonly to_date: Date

  constructor(
    { id, to_date, from_date, company_id }: LicenseType,
  ) {
    this.id = id
    this.to_date = to_date
    this.from_date = from_date
    this.company_id = company_id
  }

  totalDays(): number {
    return differenceInDays(this.to_date, this.from_date)
  }

  toDatedistance(date: Date): number {
    return differenceInDays(this.to_date, date)
  }
}

