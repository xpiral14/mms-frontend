/* eslint-disable @typescript-eslint/no-empty-interface */
import {
  ButtonProps as BluePrintButtonProps,
  Button as BluePrintButton,
  Intent,
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
  return (
    <>
      <ButtonComponent />
      {props.help && (
        <>
          {props.helpType == 'popover' ? (
            <Popover2
              content={<div className='p-2'>{props.help}</div>}
              position='right-top'
            >
              <Button minimal icon='help' />
            </Popover2>
          ) : (
            <Tooltip2 content={props.help} position='right'>
              <Button minimal icon='help' intent={Intent.PRIMARY} />
            </Tooltip2>
          )}
        </>
      )}
    </>
  )

}

export default Button
