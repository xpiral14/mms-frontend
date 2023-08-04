import React, {FunctionComponent} from 'react'
import {Collapse as BluePrintCollapse, Divider, Icon} from '@blueprintjs/core'
import {CollapseTitle} from './styles'
import Render from '../Render'

type Props = {
  isCollapsed?: boolean,
  title: React.ReactNode,
  onChange?: () => void,
  bordered?: boolean
};

const Collapse: FunctionComponent<Props> = (props) => {
  return <>
    <CollapseTitle className='d-flex gap-3' onClick={props.onChange}>
      <Render renderIf={props.isCollapsed}>
        <Icon icon='chevron-right'/>
      </Render>
      <Render renderIf={!props.isCollapsed}>
        <Icon icon='chevron-down'/>
      </Render>
      {props.title}
    </CollapseTitle>
    <BluePrintCollapse className='w-100' isOpen={!props.isCollapsed} keepChildrenMounted>
      {props.children}
    </BluePrintCollapse>
    <Render renderIf={props.bordered && props.isCollapsed}>
      <Divider />
    </Render>
  </>
}

export default Collapse
