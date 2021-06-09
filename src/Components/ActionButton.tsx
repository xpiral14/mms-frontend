import React from 'react'
import { usePanel } from '../Hooks/usePanel'

const ActionButton = ({ title, comp,  modal, ...rest }: any) => {
  const {addPanel} = usePanel()
  return (
    <button type="button" id={title} title={title} onClick={() => addPanel(title, comp, modal)} {...rest}>
      {title}
    </button>
  )
}

export default ActionButton
