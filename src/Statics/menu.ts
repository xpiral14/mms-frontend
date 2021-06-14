export default {
  Cadastro: {
    name: 'Cadastro',
    isMain: true,
    icon: 'drive-time',
    items: {
      Carros: {
        icon: 'drive-time',
        name: 'Carros',
        screen: {
          path: 'Register/Users',
          id: 'regirster-users',
          headerTitle: 'Carros',
        },
      },
      Pecas: {
        icon: 'cog',
        name: 'Peças',
        screen: {
          id: 'register-parts',
          path: 'Register/Parts',
          headerTitle: 'Peças',
        },
      },
      Funcionarios: {
        icon: 'person',
        name: 'Funcionarios',
        screen: {},
        screenSize: '400px 300px',
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
