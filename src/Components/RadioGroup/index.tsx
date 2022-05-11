import { Radio, RadioGroup as BluePrintRadioGroup } from '@blueprintjs/core'
import React from 'react'
import { RadioGroupProps } from '../../Contracts/Components/RadioGroup'
import { Container } from './style'
const RadioGroup = React.forwardRef<any, RadioGroupProps>(
  ({ onClick, ...props }, ref) => {
    return (
      <Container>
        <BluePrintRadioGroup {...props} ref={ref}>
          {props.radios?.map((radio) => (
            <Radio
              key={radio.id}
              {...radio}
              onClick={
                onClick
                  ? (evt) => onClick?.(radio.value!, evt as any)
                  : undefined
              }
            />
          ))}
        </BluePrintRadioGroup>
      </Container>
    )
  }
)

export default RadioGroup
