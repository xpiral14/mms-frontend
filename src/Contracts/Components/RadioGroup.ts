import { RadioGroupProps as BlueprintRadioGroupProps } from '@blueprintjs/core'
export interface RadioGroupProps extends BlueprintRadioGroupProps {
  radios: {
    label?: string
    value?: string
  }[]
}
