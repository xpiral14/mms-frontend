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
