import api from '../Config/api'
import Response from '../Contracts/Types/Response'
import License, { Definiton } from '../Contracts/Models/License'

export default class LicenseService {
  static async getAvailableLicenses() {
    const response = await api.get<Response<Record<string, any>[]>>('licenses')

    return response.data.data.map((license) => {
      const definition = new Definiton(license.definition.features, license.definition.default_features, license.definition.value_added_per_item)
      return new License(
        license.id,
        license.name,
        license.type,
        license.price,
        definition
      )
    })
  }
}
