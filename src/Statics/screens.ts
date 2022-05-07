import subScreens from './subScreens'

const screens = {
  'user-register': {
    id: 'user-register',
    name: 'Cadastro de usuários',
    path: 'Register/User'
  },
  'costumer-register': {
    id: 'costumer-register',
    name: 'Cadastro de clientes',
    path: 'Register/Costumer'
  },
  'employees-register': {
    id: 'employees-register',
    name: 'Cadastro de funcionários',
    path: 'Register/Employees'
  },
  'part-register': {
    id: 'part-register',
    name: 'Cadastro de produtos',
    path: 'Register/Parts'
  },
  'unit-register': {
    id: 'unit-register',
    name: 'Cadastro de unidades',
    path: 'Register/Units'
  },
  'service-register': {
    id: 'service-register',
    name: 'Cadastro de serviços',
    path: 'Register/Service'
  },
  'order-register': {
    id: 'order-register',
    name: 'Cadastro de produtos',
    path: 'Register/ServiceOrder',
  },
  'cost-posting': {
    id: 'cost-posting',
    name: 'Lançamento de custos',
    path: 'CostsPosting',
  },
  'company-data': {
    id: 'company-data',
    name: 'Dados da empresa',
    path: 'CompanyData'
  }
}
export const allScreens = {
  ...screens,
  ...subScreens
}
export default screens
