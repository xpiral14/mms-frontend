export default {
  Cadastro: {
    name: 'Cadastro',
    isMain: true,
    icon: 'drive-time',
    items: {
      Carros: {
        name: 'Carros',
        screen: 'Register/Users',
        icon: 'drive-time',
      },
      Pecas: {
        icon: 'cog',
        name: 'Peças',
        screen: 'HelloWorld2',
      },
      Funcionarios: {
        icon: 'person',
        name: 'Funcionarios',
        screen: 'RegisterPeace',
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