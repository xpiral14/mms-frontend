import React from 'react'
import {
  FileInput as BluePrintFileInput,
  FileInputProps as BluePrintFileInputProps,
  FormGroup,
  Intent,
} from '@blueprintjs/core'
import { useWindow } from '../../Hooks/useWindow'

interface FileInputProps<T = any> extends BluePrintFileInputProps {
  name: keyof T
  label?: string
  required?: boolean
  intent?: Intent
  accept?: string
}
export default function FileInput<T = any>(props: FileInputProps<T>) {
  const { changePayloadAttribute } = useWindow()
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
      style={props.style}
    >
      <BluePrintFileInput
        text='Selecionar arquivos'
        onInputChange={(e) =>
          changePayloadAttribute(props.name, e.currentTarget.files?.[0])
        }
        buttonText='Selecionar'
        inputProps={{accept: props.accept}}
        {...props}
      />
    </FormGroup>
  )
}
