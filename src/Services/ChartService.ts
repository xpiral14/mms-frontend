import api from '../Config/api'
import Response from '../Contracts/Models/Response'

export default class ChartService {
  public static getReceiptsXCosts(
    fromDate: string,
    toDate: string,
    groupType: number
  ) {
    return api.get<
      Response<
        {
          date: string
          cost_value: number
          receipt_value: number
        }[]
      >
    >('charts/receipts_x_costs', {
      params: {
        fromDate,
        toDate,
        groupType,
      },
    })
  }
}
