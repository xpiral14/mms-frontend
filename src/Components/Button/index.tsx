/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ButtonProps as BluePrintButtonProps,
  Button as BluePrintButton,
} from '@blueprintjs/core'
import React, { FC } from 'react'

interface ButtonProps extends BluePrintButtonProps {}

const Button: FC<ButtonProps> = (props) => {
  return (
    <div style={{maxHeight: 30}}>
      <BluePrintButton {...props} />
    </div>
  )
}

export default Button
