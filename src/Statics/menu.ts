import { MenuType } from '../Contracts/Containers/NavBar'
import {} from '../Contracts/Hooks/useScreen'
export default {
  Cadastro: {
    name: 'Cadastro',
    isMain: true,
    icon: 'drive-time',
    items: {
      Pecas: {
        icon: 'cog',
        name: 'Peças',
        screen: {
          id: 'register-parts',
          path: 'Register/Parts',
          headerTitle: 'Peças',
          contentSize: '750px 500px',
        },
      },
      Clientes: {
        icon: 'cog',
        name: 'Clientes',
        screen: {
          id: 'register-costumer',
          contentSize: '700px 350px',
          icon: 'person',
          headerTitle: 'Clientes',
          path: 'Register/Costumer',
        },
      },
      OrdemServico: {
        name: 'Ordem de serviços',
        icon: 'add',
        screen: {
          id: 'register-worker-order',
          contentSize: '900 500',
          headerTitle: 'Registrar ordem de serviço',
          path: 'Register/ServiceOrder',
        },
      },
      Servico: {
        name: 'Serviços',
        icon: 'add',
        screen: {
          id: 'register-order',
          contentSize: '900 500',
          headerTitle: 'Cadastrar serviços',
          path: 'Register/Service',
        },
      },
    },
  },
} as MenuType
