import React, { CSSProperties, FunctionComponent } from 'react'
import { DateInput3, DateInput3Props } from '@blueprintjs/datetime2'
import { FormGroup, Intent } from '@blueprintjs/core'
import { isValid, parse } from 'date-fns'
import { USER_TIMEZONE_NAME } from '../../Constants'
import { DateFormats } from '../../Constants/Enums'

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
  const onChange = (v: string | null, i: boolean): void => {
    if (!v) return
    return props.onChange?.(new Date(v), i)
  }
  const formatDate = (date: Date): string => {
    let dateFormat = DateFormats.DATE_ONLY
    if (props.timePrecision === 'minute') {
      dateFormat = DateFormats.DATE_SHORT_TIME
    }
    return (
      props?.formatDate?.(date) ??
      date.toLocaleDateString(undefined, dateFormat)
    )
  }
  const parseDate = (str: string): Date | false => {
    let formatString = 'dd/MM/yyyy'

    if (props.timePrecision === 'minute') {
      formatString = 'dd/MM/yyyy, HH:mm'
    }

    if (props.timePrecision === 'second') {
      formatString = 'dd/MM/yyyy, HH:mm:ss'
    }

    const value = parse(str, formatString, new Date())
    if (!isValid(value)) return false
    return value
  }
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
        parseDate={parseDate}
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
        onChange={onChange}
        formatDate={formatDate}
        showTimezoneSelect={false}
        timezone={USER_TIMEZONE_NAME}
        outOfRangeMessage='Data inválida'
      />
    </FormGroup>
  )
}

export default InputDate
