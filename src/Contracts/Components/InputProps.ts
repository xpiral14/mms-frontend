import { Intent } from '@blueprintjs/core'
import {CSSProperties} from 'react'

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string
  mask?: string
  required?: boolean
  id?: string
  placeholder?: string
  disabled?: boolean
  intent?: Intent
  defaultValue?: string
  style?: CSSProperties
  inputStyle?: CSSProperties
  help?: JSX.Element | string
}
