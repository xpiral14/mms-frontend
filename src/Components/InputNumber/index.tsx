/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonGroup, Classes, FormGroup, Icon } from '@blueprintjs/core'
import { useMemo, useRef, useState } from 'react'
import { InputProps } from '../../Contracts/Components/InputProps'
import joinClasses from '../../Util/joinClasses'
import CurrencyInput, { CurrencyInputProps } from 'react-currency-input-field'
import Button from '../Button'

export interface InputNumberProps
  extends Omit<InputProps, 'ref' | 'defaultValue' | 'step' | 'type'>,
    CurrencyInputProps {
  integerOnly?: boolean
  format?: 'currency'
}
const InputNumber = (props: InputNumberProps) => {
  const holdingMouseRef = useRef(null as NodeJS.Timeout | null)
  const className = useMemo(
    () =>
      joinClasses(
        Classes.INPUT,
        props.intent
          ? (Classes as any)[('INTENT_' + props.intent.toUpperCase()) as any]
          : '',
        props.className ?? ''
      ),
    [props.intent, props.className]
  )
  const onInputValueChange: InputNumberProps['onValueChange'] = (
    value,
    name,
    values
  ) => {
    if (props.integerOnly) {
      value = value?.replace(/,.+/g, '')
    }

    if (Number.isNaN(+value!) || value?.endsWith(',')) {
      return props.onValueChange?.(value, name, values)
    }
    const valueAsNumber = +(value?.replace(',', '.') ?? 0)
    if (typeof props.min === 'number') {
      value = String(Math.max(+props.min!, valueAsNumber))
    }

    if (typeof props.max === 'number') {
      value = String(Math.min(+props.max!, valueAsNumber))
    }

    if (values) {
      values.float = +value!
      values.value = value!
    }
    props.onValueChange?.(value, name, values)
  }
  const onDown = () => {
    let currentValue = String(
      +((String(props.value ?? '') as string).replace(',', '.') ?? 0) -
        (props.step ?? 1)
    )
    const intervalId = setInterval(() => {
      onInputValueChange?.(currentValue, props.name)
      currentValue = String(+currentValue - 1)
    }, 65)

    holdingMouseRef.current = intervalId
  }
  const onUp = () => {
    let currentValue = String(
      +((String(props.value ?? '') as string).replace(',', '.') ?? 0) +
        (props.step ?? 1)
    )
    const intervalId = setInterval(() => {
      onInputValueChange?.(currentValue, props.name)
      currentValue = String(+currentValue + 1)
    }, 65)
    holdingMouseRef.current = intervalId
  }
  const clearIntervalOnUp = () => {
    clearInterval(holdingMouseRef.current!)
    holdingMouseRef.current = null
  }
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
      style={props.style}
    >
      <CurrencyInput
        value={props.value || ''}
        disabled={props.disabled}
        placeholder={props.placeholder}
        prefix={props.format === 'currency' ? 'R$ ' : undefined}
        {...(props as any)}
        onValueChange={onInputValueChange}
        className={className}
        style={props.inputStyle}
      />
      <ButtonGroup
        vertical
        className='ml-2 bp5-fixed'
        style={{ marginLeft: 4 }}
      >
        <button
          className='bp5-button'
          style={{ maxHeight: 15, minHeight: 15 }}
          onMouseDown={onUp}
          onMouseUp={clearIntervalOnUp}
        >
          <Icon icon='chevron-up' />
        </button>
        <button
          className='bp5-button'
          style={{ maxHeight: 15, minHeight: 15 }}
          onMouseDown={onDown}
          onMouseUp={clearIntervalOnUp}
        >
          <Icon icon='chevron-down' />
        </button>
      </ButtonGroup>
    </FormGroup>
  )
}

export default InputNumber
