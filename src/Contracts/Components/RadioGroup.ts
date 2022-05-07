import { RadioGroupProps as BlueprintRadioGroupProps } from '@blueprintjs/core'
import React from 'react'
export interface RadioGroupProps extends BlueprintRadioGroupProps {
  value?: string
  id?: string;
  radios: {
    label?: string
    value?: string | number
    id?: string
  }[]

  onClick?: (value: string | number, evt: React.MouseEventHandler<HTMLInputElement>) => void
}
