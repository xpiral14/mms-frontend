import { MenuType } from '../Contracts/Containers/NavBar'
import screens from './screens'
import { GiExpense } from 'react-icons/gi'
import { MdOutlineAddBusiness } from 'react-icons/md'
import { Permissions } from '../Constants/Enums'

import {BiPackage} from 'react-icons/bi'
const menus = {
  Estoque: {
    name: 'Estoque',
    isMain: true,
    icon: 'box',
    permissions: [
      Permissions.READ_PART,
      Permissions.WRITE_PART,
      Permissions.READ_UNIT,
      Permissions.WRITE_UNIT,
    ],
    items: {
      Estoques: {
        name: 'Estoques',
        icon: <BiPackage size={20}/>,
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['stock-register'],
          contentSize: '750px 290',
        },
      },
      Produtos: {
        name: 'Produtos',
        icon: 'wrench',
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['product-register'],
          headerTitle: 'Produtos',
          contentSize: '750px 500px',
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
      Fornecedores: {
        name: 'Fornecedores',
        icon: <MdOutlineAddBusiness size={16}/>,
        screen: {
          minHeight: 175,
          maxHeight: 500,
          ...screens['supplier-register'],
          headerTitle: 'Cadastro de fornecedores',
          contentSize: '900 500',
        },
      },
    },
  },
  Vendas: {
    name: 'Vendas',
    isMain: true,
    icon: 'dollar',
    permissions: [
      Permissions.READ_CUSTOMER,
      Permissions.WRITE_CUSTOMER,
      Permissions.READ_ORDER,
      Permissions.WRITE_ORDER,
      Permissions.READ_SERVICE,
      Permissions.WRITE_SERVICE,
    ],
    items: {
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
      AssignEmployeeOrder: {
        name: 'Obter serviço',
        icon: 'add-to-artifact',
        screen: {
          ...screens['assign-employee-order'],
          contentSize: '560 90',
        },
        permissions: [Permissions.READ_ORDER, Permissions.WRITE_ORDER]
      }
    },
  },
  Financeiro: {
    name: 'Financeiro',
    isMain: true,
    icon: 'grouped-bar-chart',
    permissions: [
      Permissions.READ_RECEIPT,
      Permissions.WRITE_RECEIPT,
      Permissions.READ_COST,
      Permissions.WRITE_COST,
    ],
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
      CostPosting: {
        name: 'Lançamento de custos',
        icon: <GiExpense size={16} />,
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['cost-posting'],
          contentSize: '1065px 400px',
          headerTitle: 'Lançamento de custos',
        },
      },
      ReceiptsXCosts: {
        name: screens['receipts-x-costs'].name,
        icon: <GiExpense size={16} />,
        screen: {
          minHeight: 290,
          maxHeight: 500,
          ...screens['receipts-x-costs'],
          contentSize: '1065px 400px',
          headerTitle: screens['receipts-x-costs'].name,
        },
      },
    },
  },
  Empresa: {
    name: 'Empresa',
    isMain: true,
    icon: 'office',
    permissions: [
      Permissions.READ_EMPLOYEE,
      Permissions.WRITE_EMPLOYEE,
    ],
    items: {
      Funcionarios: {
        name: 'Funcionários',
        icon: 'people',
        screen: {
          minHeight: 240, // This has to be the contentSize height + 34px that's the height of the bar
          maxHeight: 500,
          ...screens['employees-register'],
          headerTitle: 'Funcionários',
          contentSize: '710px 240px',
        },
      },
      Clientes: {
        name: 'Clientes',
        icon: 'person',
        screen: {
          ...screens['customer-register'],
          contentSize: '900 500',
          headerTitle: 'Clientes',
        },
      },
    },
  },
  Reports: {
    name: 'Relatórios',
    isMain: true,
    icon: 'paperclip',
    screen: {
      ... screens['reports'],
      headerTitle: 'Relatórios emitidos',
      contentSize: '710px 190px',
      minHeight: 224, // This has to be the contentSize height + 34px that's the height of the bar
      maxHeight: 500,
    },
  }
} as MenuType

export default menus
