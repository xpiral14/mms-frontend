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
  'part-register': {
    id: 'part-register',
    name: 'Cadastro de produtos',
    path: 'Register/Parts'
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
  }
}
export const allScreens = {
  ...screens,
  ...subScreens
}
export default screens
