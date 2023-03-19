
import License from './License'

type Company = {
  id: number;
  name: string;
  mail?: string;
  identification: string;
  phone?: string;
  cep?: string
  complement?: string
  active_license: License
}

export default Company
