import React, { CSSProperties } from 'react'
import {
  NumericInput as BluePrintNumericInput,
  NumericInputProps as BluePrintNumericInputProps,
} from '@blueprintjs/core'
import { FC } from 'react'
import { Container } from './style'

interface NumericInputProps extends BluePrintNumericInputProps {
  id?: string
  label?: string
  width?: string
  labelPosition?: 'vertical' | 'horizontal'
  style?: CSSProperties
  maxLength?: number
  required?: boolean
}

const NumericInput: FC<NumericInputProps> = ({
  label,
  width,
  style,
  ...props
}) => {
  return (
    <Container width={width} labelPosition={props.labelPosition} style={style}>
      {label && (
        <div>
          <label htmlFor={props.id}>
            {label} {props.required && '*'}
          </label>
        </div>
      )}

      <BluePrintNumericInput {...props} />
    </Container>
  )
}

export default NumericInput
