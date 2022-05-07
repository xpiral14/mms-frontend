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
      CostPosting: {
        name: 'Lançamento de custos',
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['cost-posting'],
          contentSize: '900px 256px',
          headerTitle: 'Lançamento de custos',
        },
      },
    },
  },
  Financeiro: {
    name: 'Financeiro',
    isMain: true,
    icon: 'grouped-bar-chart',
    items: {
      ReceiptPosting: {
        name: screens['receipt-posting']?.name,
        icon: 'dollar',
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['receipt-posting'],
          contentSize: '980px 400px',
          headerTitle: screens['receipt-posting']?.name,
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
    items: {
      CompanyData: {
        name: 'Dados da empresa',
        screen: {
          ...screens['company-data'],
          contentSize: '900px 335px',
          headerTitle: 'Dados da empresa',
        },
      },
    },
  },
} as MenuType

export default menus
