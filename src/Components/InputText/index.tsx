import { Classes, FormGroup } from '@blueprintjs/core'
import InputMask from 'react-input-mask'
import React from 'react'
import { InputProps } from '../../Contracts/Components/InputProps'

const InputText: React.FC<InputProps> = (props) => {
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.itent}
      labelFor={props.id}
    >
      {props.mask ? (
        <InputMask
          mask={props.mask}
          value={props.value}
          onChange={props.onChange}
        >
          {(inputProps: any) => (
            <input {...inputProps} className={Classes.INPUT} />
          )}
        </InputMask>
      ) : (
        <input
          value={props.value}
          disabled={props.disabled}
          placeholder={props.placeholder}
          className={Classes.INPUT}
          {...(props as any)}
        />
      )}
    </FormGroup>
  )
}

export default InputText
