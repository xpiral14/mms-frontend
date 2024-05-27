import React, { FunctionComponent, useState } from 'react'
import { Collapse as BluePrintCollapse, Divider, Icon } from '@blueprintjs/core'
import { CollapseTitle } from './styles'
import Render from '../Render'

type Props = {
  isCollapsed?: boolean
  title: React.ReactNode
  onChange?: () => void
  bordered?: boolean
  controlled?: boolean
}

const Collapse: FunctionComponent<Props> = ({
  controlled = true,
  ...props
}) => {
  const [isCollapsedState, setIsCollapsedState] = useState(false)
  const isCollapsed = controlled ? props.isCollapsed : isCollapsedState
  const onChange = () => {
    props.onChange?.()
    if (!controlled) {
      setIsCollapsedState((prev) => !prev)
    }
  }
  return (
    <>
      <CollapseTitle className='flex gap-3' onClick={onChange}>
        <Render renderIf={props.isCollapsed}>
          <Icon icon='chevron-right' />
        </Render>
        <Render renderIf={!props.isCollapsed}>
          <Icon icon='chevron-down' />
        </Render>
        {props.title}
      </CollapseTitle>
      <BluePrintCollapse
        className='w-full'
        isOpen={!isCollapsed}
        keepChildrenMounted
      >
        {props.children}
      </BluePrintCollapse>
      <Render renderIf={props.bordered && props.isCollapsed}>
        <Divider />
      </Render>
    </>
  )
}

export default Collapse
