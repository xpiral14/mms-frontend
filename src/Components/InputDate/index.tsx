import React, {FunctionComponent} from 'react'
import {DateInput, DateInputProps} from '@blueprintjs/datetime'
import {FormGroup, Intent} from '@blueprintjs/core'

type Props = {
  id: string
  label?: string
  required?: boolean
  disabled?: boolean
  intent?: Intent
  labelFor?: string
} & Omit<DateInputProps, 'formatDate' | 'parseDate'>;

const InputDate: FunctionComponent<Props> = (props) => {

  return <FormGroup
    label={props.label}
    labelInfo={props.required && '*'}
    disabled={props.disabled}
    intent={props.intent}
    labelFor={props.id}
  >
    <DateInput
      inputProps={{
        id: props.id
      }}
      formatDate={(date) => date.toLocaleDateString()}
      parseDate={str => new Date(str)}
      placeholder={'dd/mm/aaaa'}
      {...props}
    />
  </FormGroup>
}

export default InputDate
