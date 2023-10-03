import React from 'react'
import DefaultInputNumber, { InputNumberProps as Default } from '../InputNumber'
import { useWindow } from '../../Hooks/useWindow'

interface InputNumberProps<T = any> extends Omit<Default, 'name'> {
  name: keyof T
}
function InputNumber<T = any>({ name, ...props }: InputNumberProps<T>) {
  const { changePayloadAttribute, payload } = useWindow()
  return (
    <DefaultInputNumber
      value={payload[name]}
      onValueChange={(v) => changePayloadAttribute(name, v)}
      {...props}
    />
  )
}

export default InputNumber
