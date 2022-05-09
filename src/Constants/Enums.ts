export enum fuelType {
  GASOLINE = 'Gasolina',
  DIESEL = 'Diesel',
  ETHANOL = 'Etanol',
  FLEX = 'Flex',
}

export enum orderStatus {
  PENDING = '1',
  WAITING_APPROVAL = '2',
  APPROVED = '3',
  IN_PROGRESS = '4',
  WAITING_PAYMENT = '5',
  DONE = '6',
  CLOSED = '7',
}

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

export enum CostType {
  HELPERS = 1,
  FOOD = 2,
  TOOLS = 3,
  TRANSPORT = 4,
  TAX = 5,
  OTHERS = 6,
} 
