import { Classes, FormGroup } from '@blueprintjs/core'
import InputMask from 'react-input-mask'
import React from 'react'
import { InputProps } from '../../Contracts/Components/InputProps'
import joinClasses from '../../Util/joinClasses'

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
          value={props.value || ''}
          onChange={props.onChange}
          disabled={props.disabled}
          placeholder={props.placeholder}
          alwaysShowMask
        >
          {(inputProps: any) => (
            <input
              {...inputProps}
              id={props.id}
              className={Classes.INPUT}
              disabled={props.disabled}
            />
          )}
        </InputMask>
      ) : (
        <input
          value={props.value || ''}
          disabled={props.disabled}
          placeholder={props.placeholder}
          className={joinClasses(
            Classes.INPUT,
            props.itent
              ? (Classes as any)[('INTENT_' + props.itent.toUpperCase()) as any]
              : ''
          )}
          {...(props as any)}
        />
      )}
    </FormGroup>
  )
}

export default InputText
