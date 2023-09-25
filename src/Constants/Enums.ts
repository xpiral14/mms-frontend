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


export enum Permissions {
  /**
   * Can read companies
   */
  READ_COMPANY = 1,

  /**
   * Can do write operations in company
   */
  WRITE_COMPANY = 2,

  /**
   * Can read roles
   */
  READ_ROLE = 3,

  /**
   * Can do write operations in roles
   */
  WRITE_ROLE = 4,

  /**
   * Can read users
   */
  READ_USER = 5,

  /**
   * Can do write operations in users
   */
  WRITE_USER = 6,

  /**
   * Can read users
   */
  READ_VEHICLE = 7,

  /**
   * Can do write operations in users
   */
  WRITE_VEHICLE = 8,

  /**
   * Can do write operations in users
   */
  READ_PIECE = 9,

  /**
   * Can do write operations in users
   */
  WRITE_PIECE = 10,

  /**
   * Can do write operations in users
   */
  READ_ORDER = 11,

  /**
   * Can do write operations in users
   */
  WRITE_ORDER = 12,

  /**
   * Can do write operations in services'
   */
  READ_SERVICE = 13,

  /**
   * Can do write operations in services
   */
  WRITE_SERVICE = 14,

  /**
   * Can do read operations in units
   */
  READ_UNIT = 15,

  /**
   * Can do write operations in units
   */
  WRITE_UNIT = 16,

  /**
   * Can do read operations in products
   */
  READ_PART = 17,

  /**
   * Can do write operations in products
   */
  WRITE_PART = 18,

  /**
   * Can do read operations in customers
   */
  READ_CUSTOMER = 19,

  /**
   * Can do write operations in customers
   */
  WRITE_CUSTOMER = 20,

  /**
   * Can do read operations in employees
   */
  READ_EMPLOYEE = 21,

  /**
   * Can do write operations in employees
   */
  WRITE_EMPLOYEE = 22,

  /**
   * Can do read operations in costs
   */
  READ_COST = 23,

  /**
   * Can do write operations in costs
   */
  WRITE_COST = 24,

  /**
   * Can do read operations in receipts
   */
  READ_RECEIPT = 25,

  /**
   * Can do write operations in receipts
   */
  WRITE_RECEIPT = 26,

  /**
   * Can do read operations in stocks
   */
  READ_STOCK = 29,

  /**
   * Can do write operations in stocks
   */
  WRITE_STOCK = 30,
}

export enum PaymentTypes {
  CREDIT = 'credit_card',
  DEBIT = 'debit_card',
  BANK_SLIP = 'bank_slip',
  CHECK = 'check',
  PIX = 'pix',
}

export enum BillStatuses {
  OPENED = 'opened',
  PAID = 'paid',
  EXPIRED = 'expired',
}

export const DateFormats = {
  DATE_ONLY: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  } as Intl.DateTimeFormatOptions,
  DATE_SHORT_TIME: {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    'minute': '2-digit'
  }as Intl.DateTimeFormatOptions
}
