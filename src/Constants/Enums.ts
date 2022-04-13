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

export const getEnumValues = (enumType: any): string[] => {
  return Object.values(enumType)
}
