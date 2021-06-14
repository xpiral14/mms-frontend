import { Intent } from '@blueprintjs/core'

export interface InputProps {
  label?: string
  mask?: string
  required?: boolean
  id: string
  placeholder?: string
  disabled?: boolean
  itent?: Intent
  defaultValue?: string
}
