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
}

const NumericInput: FC<NumericInputProps> = ({ label, ...props }) => {
  return (
    <Container>
      {label && <label htmlFor={props.id}>{label}</label>}
      <BluePrintNumericInput {...props} />
    </Container>
  )
}

export default NumericInput
