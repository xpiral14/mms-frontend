export interface Validation {
  check: () => boolean
  errorMessage: string
  tabId?: string
  inputId?: string
}

export interface CheckedValidation extends Validation {
  checked: boolean
}

export type ValidationOptions = {
  stopOnFirstError?: boolean
}
