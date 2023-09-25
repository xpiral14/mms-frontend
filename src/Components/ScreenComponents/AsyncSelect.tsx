import DefaultAsyncSelect, {
  AsyncSelectProps as DefaultAsyncSelectProps,
} from '../AsyncSelect'
import { useWindow } from '../../Hooks/useWindow'
import { useCallback } from 'react'

interface AsyncSelectProps<T = any> extends DefaultAsyncSelectProps {
  name: keyof T
}
function AsyncSelect<T = any>(props: AsyncSelectProps<T>) {
  const { changePayloadAttribute, payload } = useWindow()
  const onChange = useCallback(
    (item) => {
      changePayloadAttribute(props.name, item.value)
    },
    []
  )
  return (
    <DefaultAsyncSelect
      activeItem={payload[props.name]}
      onChange={onChange}
      {...props}
    />
  )
}

export default AsyncSelect
