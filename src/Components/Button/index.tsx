/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ButtonProps as BluePrintButtonProps,
  Button as BluePrintButton,
} from '@blueprintjs/core'
import { Popover2, Tooltip2 } from '@blueprintjs/popover2'
import { FC, useCallback } from 'react'

interface ButtonProps extends BluePrintButtonProps {
  title?: string
  help?: JSX.Element | string
  helpType?: 'tooltip' | 'popover'
}

const Button: FC<ButtonProps> = (props) => {
  const ButtonComponent = useCallback(
    () => <BluePrintButton {...props}>{props.children}</BluePrintButton>,
    [props]
  )
  return props.help ? (
    props.helpType == 'popover' ? (
      <Popover2 content={props.help} position='right-top'>
        <ButtonComponent />
      </Popover2>
    ) : (
      <Tooltip2 content={props.help} position='right'>
        <ButtonComponent />
      </Tooltip2>
    )
  ) : (
    <ButtonComponent />
  )
}

export default Button
