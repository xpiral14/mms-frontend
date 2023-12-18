import { Permissions, ScreenStatus } from '../Constants/Enums'
import { Screens } from '../Contracts/Hooks/useScreen'

const screens = {
  'user-register': {
    id: 'user-register',
    name: 'Cadastro de usuários',
    path: 'Register/User',
    permissions: [Permissions.READ_USER, Permissions.WRITE_USER],
  },
  'customer-register': {
    id: 'customer-register',
    name: 'Cadastro de clientes',
    path: 'Register/Customer',
    permissions: [Permissions.READ_CUSTOMER, Permissions.WRITE_CUSTOMER],
  },
  'employees-register': {
    id: 'employees-register',
    name: 'Cadastro de funcionários',
    path: 'Register/Employees',
    permissions: [Permissions.READ_EMPLOYEE, Permissions.WRITE_EMPLOYEE],
  },
  'product-register': {
    id: 'product-register',
    name: 'Cadastro de produtos',
    path: 'Register/Products',
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
    windowProps: {
      screenStatus: ScreenStatus.EDIT
    }
  },
  'order-service-details': {
    id: 'order-service-details',
    name: 'Serviços da ordem',
    path: 'OrderServiceDetails',
    subScreenOnly: true,
    permissions: [Permissions.WRITE_ORDER],
  },
  'order-product-details': {
    id: 'order-product-details',
    name: 'Produtos da ordem',
    path: 'OrderProductDetails',
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
  'bill-register': {
    id: 'bill-register',
    name: 'Contas a pagar',
    path: 'Finance/Bill',
  },
  'bill-receipt-register': {
    id: 'bill-receipt-register',
    name: 'Contas a receber',
    path: 'Finance/BillReceipt',
  },
  'bill-payment': {
    id: 'bill-payment',
    name: 'Pagar conta(s)',
    path: 'Finance/BillPayment',
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
  'product-stock-management': {
    id: 'product-stock-management',
    name: 'Gerenciamento de produtos do estoque',
    path: 'ProductStockManagement',
    subScreenOnly: true,
    permission: [Permissions.READ_STOCK, Permissions.WRITE_STOCK],
  },
  'product-stock-warning': {
    id: 'product-stock-warning',
    name: 'Gerenciamento de produtos do estoque',
    path: 'ProductStockWarning',
    subScreenOnly: true,
    permission: [Permissions.READ_STOCK, Permissions.WRITE_STOCK],
  },
  'reports': {
    id: 'reports',
    name: 'Relatórios emitidos',
    path: 'Reports',
    subScreenOnly: true,
    permission: [Permissions.READ_STOCK, Permissions.WRITE_STOCK],
  },
  'supplier-register': {
    id: 'supplier-register',
    name: 'Cadastro de fornecedores',
    path: 'Register/Suppliers',
    permissions: [Permissions.READ_EMPLOYEE, Permissions.WRITE_EMPLOYEE]
  },
  'goods-register': {
    id: 'goods-register',
    name: 'Gerenciamento de mercadorias',
    path: 'Register/Goods',
    subScreenOnly: true,
    permissions: [Permissions.READ_EMPLOYEE, Permissions.WRITE_EMPLOYEE],
    contentSize: '980 340'
  },
  'good-product-register': {
    id: 'good-product-register',
    name: 'Cadastro de produto nas mercadorias',
    path: 'AddProductToGood',
    subScreenOnly: true,
    permissions: [Permissions.READ_EMPLOYEE, Permissions.WRITE_EMPLOYEE],
    contentSize: '600 220',
  },
  'distribute-goods': {
    id: 'distribute-goods',
    name: 'Distribuição de mercadorias para o estoque',
    path: 'DistributeGoods',
    subScreenOnly: true,
    permissions: [Permissions.READ_EMPLOYEE, Permissions.WRITE_EMPLOYEE],
    contentSize: '800 500'
  },
  'dynamic-report': {
    id: 'dynamic-report',
    name: 'Relatório dinâmico',
    path: 'DynamicReportScreen',
    subScreenOnly: true,
    contentSize: '800 500'
  },
  'product-stock-movement': {
    id: 'product-stock-movement',
    name: 'Movimentações do produto no estoque',
    path: 'ProductStockMovement',
    subScreenOnly: true,
    contentSize: '800 500'
  },
  'cost-center-register': {
    id: 'cost-center-register',
    name: 'Cadastro de unidades',
    path: 'Register/CostCenter',
  },
  'settings': {
    id: 'settings',
    name: 'Configurações',
    path: 'Settings',
  }
} as Screens


export default screens
