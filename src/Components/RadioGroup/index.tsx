import { Radio, RadioGroup as BluePrintRadioGroup } from '@blueprintjs/core'
import React from 'react'
import { RadioGroupProps } from '../../Contracts/Components/RadioGroup'

const RadioGroup = React.forwardRef<any, RadioGroupProps>((props, ref) => {
  return (
    <BluePrintRadioGroup  {...props} ref={ref}>
      {props.radios?.map((radio) => (
        <Radio key={radio.value} {...radio} />
      ))}
    </BluePrintRadioGroup>
  )
})

export default RadioGroup
