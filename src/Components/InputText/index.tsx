import { Classes, FormGroup } from '@blueprintjs/core'
import InputMask from 'react-input-mask'
import React, { useMemo } from 'react'
import { InputProps } from '../../Contracts/Components/InputProps'
import joinClasses from '../../Util/joinClasses'

const InputText: React.FC<InputProps> = (props) => {

  const className = useMemo(() => joinClasses(
    Classes.INPUT,
    props.intent
      ? (Classes as any)[('INTENT_' + props.intent.toUpperCase()) as any]
      : '',
    props.className ?? ''
  ), [props.intent, props.className])
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
      style={props.style}
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
              className={className}
              id={props.id}
              disabled={props.disabled}
              style={props.inputStyle}
            />
          )}
        </InputMask>
      ) : (
        <input
          value={props.value || ''}
          disabled={props.disabled}
          placeholder={props.placeholder}
          {...(props as any)}
          className={className}
          style={props.inputStyle}
        />
      )}
    </FormGroup>
  )
}

export default InputText
