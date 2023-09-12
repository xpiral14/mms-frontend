import React from 'react'
import {
  Switch as BluePrintSwitch,
  SwitchProps as BluePrintSwitchProps,
} from '@blueprintjs/core'
import { useWindow } from '../../Hooks/useWindow'

interface CheckboxProps<T = any> extends Omit<BluePrintSwitchProps, 'name'> {
  name: keyof T
}
function Switch<T = any>({ name, ...switchProps }: CheckboxProps<T>) {
  const { payload, changePayloadAttribute } = useWindow<T>()
  return (
    <BluePrintSwitch
      onChange={(e) => changePayloadAttribute(name, e.currentTarget.checked)}
      checked={Boolean(payload[name])}
      {...switchProps}
    />
  )
}

export default Switch
