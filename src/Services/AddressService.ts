import { cepApi } from '../Config/api'

export default class AddressService {
  public static getAddressFromCep(cep: string){
    return cepApi.get(`/${cep}/json`)
  }
}
