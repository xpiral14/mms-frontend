export default {
  Cadastro: {
    name: 'Cadastro',
    isMain: true,
    icon: 'drive-time',
    items: {
      Carros: {
        name: 'Carros',
        screen: {
          path: 'Register/Users',
          id: 'regirster-users',
          headerTitle: 'Carros',
        },
        icon: 'drive-time',
      },
      Pecas: {
        icon: 'cog',
        name: 'Peças',
        screen: {
          id: 'HelloWorld2',
          path: 'Register/Users',
          headerTitle: 'Peças',
        },
      },
      Funcionarios: {
        icon: 'person',
        name: 'Funcionarios',
        screen: {
        },
        screenSize: '400px 300px',
      },
      Clientes: {
        icon: 'cog',
        name: 'Clientes',
        screen: 'Register/Costumer',
      },
    },
  },
  Relatorios: {
    name: 'Relatórios',
    isMain: true,
    items: {
      'Relatório de peças': {
        name: 'Relatório de peças',
        screen: 'PeaceReport',
        items: {
          'Peças 1': {
            icon: 'drive-time',
            name: 'Peças 1',
            screen: 'RegisterPeace',
          },
        },
      },
    },
  },
}
