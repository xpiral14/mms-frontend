import React, { CSSProperties, FunctionComponent } from 'react'
import { DateInput3, DateInput3Props } from '@blueprintjs/datetime2'
import { FormGroup, Intent } from '@blueprintjs/core'
import { parse } from 'date-fns'

type Props = {
  id: string
  label?: string
  required?: boolean
  disabled?: boolean
  intent?: Intent
  labelFor?: string
  style?: CSSProperties
  formatDate?: (date: Date) => string
  value?: string | Date
  onChange: (date: Date, isUserChange: boolean) => void
} & Omit<DateInput3Props, 'parseDate' | 'formatDate' | 'value' | 'onChange'>

const InputDate: FunctionComponent<Props> = (props) => {
  console.log(
    (props.value as any) instanceof Date,
    (props.value as any) instanceof Date
      ? (props?.value as any).toISOString()
      : props.value
  )
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
      style={{
        width: props.fill ? '100%' : undefined,
        ...props.style,
      }}
    >
      <DateInput3
        invalidDateMessage='Data inválida'
        highlightCurrentDay
        todayButtonText='Hoje'
        inputProps={{
          id: props.id,
        }}
        parseDate={(str) => parse(str, 'dd/MM/yyyy', new Date())}
        placeholder='dd/mm/aaaa'
        popoverProps={{
          boundary: document.body,
        }}
        {...props}
        value={
          (props.value as any) instanceof Date
            ? (props?.value as any).toISOString()
            : props.value
        }
        onChange={(v, i) => {
          if (!v) return
          return props.onChange?.(new Date(v), i)
        }}
        formatDate={(date) =>
          props?.formatDate?.(date) ?? date.toLocaleDateString()
        }
        showTimezoneSelect={false}
      />
    </FormGroup>
  )
}

export default InputDate
