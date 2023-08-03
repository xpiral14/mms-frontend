import React, {FunctionComponent} from 'react'
import {DateInput, DateInputProps} from '@blueprintjs/datetime'
import {FormGroup, Intent} from '@blueprintjs/core'
import { parse } from 'date-fns'

type Props = {
  id: string
  label?: string
  required?: boolean
  disabled?: boolean
  intent?: Intent
  labelFor?: string
} & Omit<DateInputProps, 'formatDate' | 'parseDate'>;

const InputDate: FunctionComponent<Props> = (props) => {

  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
      style={{
        width: props.fill ? '100%' : undefined
      }}
    >
      <DateInput
        invalidDateMessage='Data inválida'
        highlightCurrentDay
        todayButtonText='Hoje'
        inputProps={{
          id: props.id,
        }}
        formatDate={(date) => date.toLocaleDateString()}
        parseDate={(str) => parse(str, 'dd/MM/yyyy', new Date())}
        placeholder={'dd/mm/aaaa'}
        {...props}
      />
    </FormGroup>
  )
}

export default InputDate
