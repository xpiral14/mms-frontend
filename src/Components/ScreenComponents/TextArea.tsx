import React from 'react'
import DefaultTextArea, { TextAreaProps as DefaultTextAreaProps } from '../TextArea'
import { useWindow } from '../../Hooks/useWindow'

export interface ATextAreaProps<T = any>
  extends Omit<DefaultTextAreaProps, 'name'> {
  name: keyof T
}
function TextArea<T = any>({ name, ...props }: ATextAreaProps<T>) {
  const { payload, changePayloadAttribute } = useWindow()
  return (
    <DefaultTextArea
      name={name as string}
      {...props}
      value={payload[name] as string}
      onChange={(e) => changePayloadAttribute(name, e.target.value)}
    />
  )
}

export default TextArea
