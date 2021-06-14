import { Classes, FormGroup } from '@blueprintjs/core'
import InputMask from 'react-input-mask'
import React from 'react'
import { InputProps } from '../../Contracts/Components/InputProps'

const InputText = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
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
            defaultValue={props.defaultValue}
            disabled={props.disabled}
            ref={ref as any}
            mask={props.mask}
            placeholder={props.placeholder}
            className={Classes.INPUT}
            {...props}
          />
        ) : (
          <input
            defaultValue={props.defaultValue}
            disabled={props.disabled}
            ref={ref}
            placeholder={props.placeholder}
            className={Classes.INPUT}
            {...props}
          />
        )}
      </FormGroup>
    )
  }
)

export default InputText
