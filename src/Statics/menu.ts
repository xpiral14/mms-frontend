import {MenuType} from '../Contracts/Containers/NavBar'
import screens from './screens'

const menus = {
  Cadastro: {
    name: 'Cadastro',
    isMain: true,
    icon: 'drive-time',
    items: {
      Pecas: {
        name: 'Peças',
        screen: {
          ...screens['part-register'],
          headerTitle: 'Peças',
          contentSize: '750px 500px',
        },
      },
      Clientes: {
        name: 'Clientes',
        screen: {
          ...screens['part-register'],
          contentSize: '900 500',
          icon: 'person',
          headerTitle: 'Clientes',
        },
      },
      OrdemServico: {
        name: 'Ordem de serviços',
        icon: 'add',
        screen: {
          ...screens['order-register'],
          contentSize: '900 500',
          headerTitle: 'Registrar ordem de serviço',
        },
      },
      Servico: {
        name: 'Serviços',
        icon: 'add',
        screen: {
          ...screens['service-register'],
          contentSize: '900 500',
          headerTitle: 'Criação de Serviços',
        },
      },
    },
  }
} as MenuType

export default menus


