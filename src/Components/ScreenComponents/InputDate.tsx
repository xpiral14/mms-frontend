import React, { useCallback } from 'react'
import DefaultInputDate, {  Props as Default } from '../InputDate'
import { useWindow } from '../../Hooks/useWindow'

interface InputNumberProps<T = any> extends Omit<Default, 'name' | 'onChange'> {
  name: keyof T
}
function InputDate<T = any>({ name, ...props }: InputNumberProps<T>) {
  const { changePayloadAttribute, payload } = useWindow()
  let onChange = useCallback((v) => {
    changePayloadAttribute(name, v)
  }, [changePayloadAttribute])
  return (
    <DefaultInputDate
      value={payload[name]}
      onChange={onChange}
      {...props}
    />
  )
}

export default InputDate
