import DefaultSelect, { SelectProps as DefaultSelectProps } from '../Select'
import { useWindow } from '../../Hooks/useWindow'
import { useCallback } from 'react'
import { Option } from '../../Contracts/Components/Suggest'

interface SelectProps<T> extends DefaultSelectProps<T> {
  name: keyof T
}

function Select<T = any>({ name, ...props }: SelectProps<T>) {
  const { changePayloadAttribute, payload } = useWindow<T>()
  const onChange = useCallback((option: Option) => changePayloadAttribute(name, option.value), [])
  return <DefaultSelect<T> onChange={onChange} {...props} activeItem={payload[name] as any}/>
}

export default Select
