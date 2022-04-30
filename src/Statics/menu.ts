import { MenuType } from '../Contracts/Containers/NavBar'
import screens from './screens'

const menus = {
  Estoque: {
    name: 'Estoque',
    isMain: true,
    icon: 'box',
    items: {
      Produtos: {
        name: 'Produtos',
        icon: 'wrench',
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['part-register'],
          headerTitle: 'Produtos',
          contentSize: '750px 246px',
        },
      },
      Unidades: {
        name: 'Unidades',
        icon: 'numerical',
        screen: {
          minHeight: 150,
          maxHeight: 500,
          ...screens['unit-register'],
          headerTitle: 'Unidades',
          contentSize: '710px 150px',
        },
      },
      Clientes: {
        name: 'Clientes',
        screen: {
          ...screens['part-register'],
          headerTitle: 'Peças',
          contentSize: '750px 500px',
        },
      },
    },
  },
  Vendas: {
    name: 'Vendas',
    isMain: true,
    icon: 'dollar',
    items: {
      Clientes: {
        name: 'Clientes',
        icon: 'person',
        screen: {
          ...screens['costumer-register'],
          contentSize: '900 500',
          headerTitle: 'Clientes',
        },
      },
      OrdemServico: {
        name: 'Ordem de serviços',
        icon: 'clipboard',
        screen: {
          ...screens['order-register'],
          contentSize: '1100 500',
          headerTitle: 'Registrar ordem de serviço',
        },
      },
      Servico: {
        name: 'Serviços',
        icon: 'build',
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['service-register'],
          contentSize: '900px 256px',
          headerTitle: 'Criação de Serviços',
        },
      },
    },
  },
  Empresa: {
    name: 'Empresa',
    isMain: true,
    icon: 'office',
    items: {
      Funcionarios: {
        name: 'Funcionários',
        icon: 'people',
        screen: {
          minHeight: 224, // This has to be the contentSize height + 34px that's the height of the bar
          maxHeight: 500,
          ...screens['employees-register'],
          headerTitle: 'Funcionários',
          contentSize: '710px 190px',
        },
      },
    },
  },
  Configuracoes: {
    name: 'Configurações',
    icon: 'cog',
    isMain: true,
    items: {},
  },
} as MenuType

export default menus
