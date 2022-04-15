export enum fuelType {
  GASOLINE = 'Gasolina',
  DIESEL = 'Diesel',
  ETHANOL = 'Etanol',
  FLEX = 'Flex',
}

export enum orderStatus {
  PENDING = '1',
  EXECUTING = '2',
  EXECUTED = '3',
  CANCELED = '4',
  DELETED = '5',
}

export const OrderStatusByValue =  [
  '', 'Pendente', 'Executando', 'Executada', 'Cancelada', 'Deletada'
]

export enum ScreenStatus {
  VISUALIZE = 'visualize',
  NEW = 'new',
  EDIT = 'edit',
  SEE_REGISTERS = 'see_registers',
}

export enum PersonType {
  PHYSICAL = '1',
  LEGAL = '2',
}

export enum DiscountType {
  PERCENT = 'percent',
  VALUE = 'value'
}

export const DiscountTypeTranslated = {
  percent: 'Porcentagem',
  value: 'Valor1',
}

export const DiscountTypeSymbol: Record<string, string> = {
  percent: '%',
  value: 'R$',
}

export const getEnumValues = (enumType: any): string[] => {
  return Object.values(enumType)
}
