import DefaultInputText from '../InputText'
import { InputProps as DefaultInputProps } from '../../Contracts/Components/InputProps'
import { useWindow } from '../../Hooks/useWindow'

interface AInputTextProps<T = any> extends Omit<DefaultInputProps, 'name'> {
  name: keyof T
}
function InputText<T = any>({ name, ...props }: AInputTextProps<T>) {
  const { payload, changePayloadAttribute } = useWindow()
  return (
    <DefaultInputText
      value={payload[name]}
      onChange={(e) => changePayloadAttribute(name, e.target.value)}
      {...props}
    />
  )
}

export default InputText
