import React from 'react'

import {
  TextArea as BlueprintTextArea,
  TextAreaProps as BlueprintTextAreaProps,
} from '@blueprintjs/core'
import { FC } from 'react'
import { Container } from './style'

interface TextAreaProps extends BlueprintTextAreaProps {
  label?: string
  id: string
}

const TextArea: FC<TextAreaProps> = ({ label, ...props }) => {
  return (
    <Container>
      {label && <label htmlFor={props.id}>{label}</label>}
      <BlueprintTextArea {...props} />
    </Container>
  )
}

export default TextArea
