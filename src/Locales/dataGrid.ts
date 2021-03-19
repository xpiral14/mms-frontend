export const GRID_LOCALE_PT_BR = {
  // Root
  rootGridLabel: 'grid',
  noRowsLabel: 'Nenhuma linha',
  errorOverlayDefaultLabel: 'Ocorreu um erro',

  // Density selector toolbar button text
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Comfortável',

  // Columns selector toolbar button text
  toolbarColumns: 'Colunas',
  toolbarColumnsLabel: 'Selecionar colunas',

  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Mostrar filtros',
  toolbarFiltersTooltipHide: 'Esconder filtros',
  toolbarFiltersTooltipShow: 'Mostrar filtros',
  toolbarFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtros ativos`,

  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Baixar como CSV',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Buscar coluna',
  columnsPanelTextFieldPlaceholder: 'Titulo da coluna',
  columnsPanelDragIconLabel: 'Reordenizar coluna',
  columnsPanelShowAllButton: 'Mostrar tudo',
  columnsPanelHideAllButton: 'Esconder tudo',

  // Filter panel text
  filterPanelAddFilter: 'Adicionar filtro',
  filterPanelDeleteIconLabel: 'Deletar',
  filterPanelOperators: 'Operadores',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'OU',
  filterPanelColumns: 'Colunas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Valor do filtro',

  // Filter operators text
  filterOperatorContains: 'contém',
  filterOperatorEquals: 'igual ',
  filterOperatorStartsWith: 'começa com',
  filterOperatorEndsWith: 'termina com',
  filterOperatorIs: 'é',
  filterOperatorNot: 'não é',
  filterOperatorAfter: 'é depois',
  filterOperatorOnOrAfter: 'is on or after',
  filterOperatorBefore: 'is before',
  filterOperatorOnOrBefore: 'is on or before',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Mostrar colunas',
  columnMenuFilter: 'Filtro',
  columnMenuHideColumn: 'Esconder',
  columnMenuUnsort: 'Restaurar ordem',
  columnMenuSortAsc: 'Ordenar ASC',
  columnMenuSortDesc: 'Ordenar DESC',

  // Column header text
  columnHeaderFiltersTooltipActive: (count: number) =>
    count !== 1 ? `${count} filtros ativos` : `${count} filtro ativo`,
  columnHeaderFiltersLabel: 'Mostrar filtros',
  columnHeaderSortIconLabel: 'Sort',

  // Rows selected footer text
  footerRowSelected: (count: number) =>
    count !== 1
      ? `${count.toLocaleString()} linhas selecionadas`
      : `${count.toLocaleString()} linha selecionada`,

  // Total rows footer text
  footerTotalRows: 'Total Linhas:',
}