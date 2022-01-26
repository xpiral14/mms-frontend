import { RadioGroupProps as BlueprintRadioGroupProps } from '@blueprintjs/core'
export interface RadioGroupProps extends BlueprintRadioGroupProps {
  value?: string
  id?: string;
  radios: {
    label?: string
    value?: string | number
    id?: string
  }[]
}
