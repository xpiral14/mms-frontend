import React, { FunctionComponent } from 'react'
import {
  InputGroup as BlueprintInputGroup,
  InputGroupProps2,
} from '@blueprintjs/core'
import { FormGroup, Intent } from '@blueprintjs/core'
import Select, { SelectProps } from '../Select'

type Props = {
  id: string
  label?: string
  required?: boolean
  disabled?: boolean
  intent?: Intent
  labelFor?: string
  onSelectChange?: () => void
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined
  selectProps?: SelectProps
} & InputGroupProps2

const InputGroup: FunctionComponent<Props> = ({ selectProps, ...props }) => {
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
    >
      <BlueprintInputGroup
        type='number'
        className='disable-arrows'
        onChange={props.onChange}
        rightElement={<Select {...selectProps} disabled = {selectProps?.disabled ?? props.disabled} />}
        {...props}
      />
    </FormGroup>
  )
}

export default InputGroup
