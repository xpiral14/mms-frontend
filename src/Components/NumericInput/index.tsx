import React from 'react'
import {
  NumericInput as BluePrintNumericInput,
  NumericInputProps as BluePrintNumericInputProps,
} from '@blueprintjs/core'
import { FC } from 'react'
import { Container } from './style'

interface NumericInputProps extends BluePrintNumericInputProps {
  id: string
  label?: string
  width?: string
  labelPosition?: 'vertical' | 'horizontal'
}

const NumericInput: FC<NumericInputProps> = ({ label, ...props }) => {
  return (
    <Container width={props.width} labelPosition={props.labelPosition}>
      {label && (
        <div>
          <label htmlFor={props.id}>{label}</label>
        </div>
      )}
      <BluePrintNumericInput {...props} />
    </Container>
  )
}

export default NumericInput
