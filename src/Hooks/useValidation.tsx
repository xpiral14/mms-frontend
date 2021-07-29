import {
  CheckedValidation,
  Validation,
  ValidationOptions,
} from '../Contracts/Hooks/useValidation'
import { useAlert } from './useAlert'
import { useWindow } from './useWindow'

const getFirstError = (errors: Validation[]) => {
  for (let index = 0; index < errors.length; index++) {
    const error = errors[index]
    if (!error.check()) return [error] as CheckedValidation[]
  }

  return []
}

const getAllErrors = (errors: Validation[]) => {
  return errors.filter((error) => !error.check()) as CheckedValidation[]
}

export default function useValidation(
  errors: Validation[],
  options?: ValidationOptions
) {
  const { openAlert } = useAlert()
  const { setActiveTab } = useWindow()

  const validate = () => {
    const checkedErrors = options?.stopOnFirstError
      ? getFirstError(errors)
      : getAllErrors(errors)

    const errorList = checkedErrors.map((error) => (
      <li key={error.inputId}>{error.errorMessage}</li>
    ))

    if (errorList.length) {
      openAlert({
        text: <ul>{errorList}</ul>,
        onClose: () => {
          setActiveTab?.(checkedErrors[0].tabId || '0')
          document.getElementById(checkedErrors[0].inputId || '')?.focus()
        },
        onCancel: () => {
          setActiveTab?.(checkedErrors[0].tabId || '0')
          document.getElementById(checkedErrors[0].inputId || '')?.focus()
        },
        onConfirm: () => {
          setActiveTab?.(checkedErrors[0].tabId || '0')
          document.getElementById(checkedErrors[0].inputId || '')?.focus()
        },
      })

      return false
    }

    return true
  }

  return { validate }
}
