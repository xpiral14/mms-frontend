import { Permissions } from '../Constants/Enums'
import { Screens } from '../Contracts/Hooks/useScreen'

const screens = {
  'user-register': {
    id: 'user-register',
    name: 'Cadastro de usuários',
    path: 'Register/User',
    permissions: [Permissions.READ_USER, Permissions.WRITE_USER],
  },
  'costumer-register': {
    id: 'costumer-register',
    name: 'Cadastro de clientes',
    path: 'Register/Costumer',
    permissions: [Permissions.READ_CUSTOMER, Permissions.WRITE_CUSTOMER],
  },
  'employees-register': {
    id: 'employees-register',
    name: 'Cadastro de funcionários',
    path: 'Register/Employees',
    permissions: [Permissions.READ_EMPLOYEE, Permissions.WRITE_EMPLOYEE],
  },
  'part-register': {
    id: 'part-register',
    name: 'Cadastro de produtos',
    path: 'Register/Parts',
    permissions: [Permissions.READ_PART, Permissions.WRITE_PART],
  },
  'unit-register': {
    id: 'unit-register',
    name: 'Cadastro de unidades',
    path: 'Register/Units',
    permissions: [Permissions.READ_UNIT, Permissions.WRITE_UNIT],
  },
  'service-register': {
    id: 'service-register',
    name: 'Cadastro de serviços',
    path: 'Register/Service',
    permissions: [Permissions.READ_SERVICE, Permissions.WRITE_USER],
  },
  'order-register': {
    id: 'order-register',
    name: 'Cadastro de ordem de serviços',
    path: 'Register/ServiceOrder',
    permissions: [Permissions.READ_ORDER, Permissions.WRITE_ORDER],
  },
  'cost-posting': {
    id: 'cost-posting',
    name: 'Lançamento de custos',
    path: 'CostPosting',
    permissions: [Permissions.READ_COST, Permissions.WRITE_COST],
  },
  'company-data': {
    id: 'company-data',
    name: 'Dados da empresa',
    path: 'CompanyData',
    permissions: [Permissions.READ_COMPANY, Permissions.WRITE_COMPANY],
  },
  'receipt-posting': {
    id: 'receipt-posting',
    name: 'Lançamento de recebimentos',
    path: 'ReceiptPosting',
    permissions: [Permissions.READ_RECEIPT, Permissions.WRITE_RECEIPT],
  },
  'user-data': {
    id: 'user-data',
    name: 'Dados do usuário',
    path: 'UserData',
  },
  'order-service-details': {
    id: 'order-service-details',
    name: 'Serviços da ordem',
    path: 'OrderServiceDetails',
    subScreenOnly: true,
    permissions: [Permissions.WRITE_ORDER],
  },
  'order-part-details': {
    id: 'order-part-details',
    name: 'Produtos da ordem',
    path: 'OrderPartDetails',
    subScreenOnly: true,
    permissions: [Permissions.WRITE_ORDER],
  },
  'order-resume': {
    id: 'order-resume',
    name: 'Detalhes da ordem',
    path: 'OrderResume',
    subScreenOnly: true,
    contentSize: '770 430',
    permissions: [Permissions.READ_ORDER],
  },
  'receipts-x-costs': {
    id: 'receipts-x-costs',
    name: 'Receitas x Custos',
    path: 'Finance/ReceiptXCosts',
    subScreenOnly: true,
    permissions: [Permissions.READ_ORDER],
  },
  'assign-employee-order': {
    id: 'assign-employee-order',
    name: 'Obter serviço',
    path: 'Order/AssignEmployeeToOrder',
    subScreenOnly: true,
    permissions: [Permissions.READ_ORDER],
  },
  'stock-register': {
    id: 'stock-register',
    name: 'Estoques',
    path: 'Register/Stock',
    permission: [Permissions.READ_STOCK, Permissions.WRITE_STOCK],
  },
  'part-stock-management': {
    id: 'part-stock-management',
    name: 'Gerenciamento de produtos do estoque',
    path: 'PartStockManagement',
    subScreenOnly: true,
    permission: [Permissions.READ_STOCK, Permissions.WRITE_STOCK],
  },
} as Screens


export default screens
