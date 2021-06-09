export default {
  Cadastro: { // 0 <Popuver />
    name: 'Cadastro',
    items: {
      Funcionários: { // 1 <MenuItem />
        name: 'Funcionários',
        screen: 'RegisterEmployee',
      },
      Peças: {
        name: 'Peças',
        screen: ''
      },
      Carros: {
        icon: 'drive-time',
        name: 'Carros',
        screen: 'RegisterPeace',
      },
    },
  },
  Relatórios: {
    name: 'Relatórios',
    items: {
      Peças: {
        name: 'Peças',
        screen: 'PeaceReport',
      },
    },
  },
}
