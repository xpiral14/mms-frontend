import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

const Portal = ({ rootNode, children }: any) => {
  const [element] = useState(() => document.createElement('div'))
  useEffect(() => {
    rootNode.appendChild(element)

    return () => {
      rootNode.removeChild(element)
    }
  })

  return createPortal(children, element)
}

export default Portal
