/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { lazy, Suspense } from 'react'
import { Button } from '@blueprintjs/core'
import { usePanel } from '../Hooks/usePanel'
import Hello from '../Screens/HelloWorld'
export default function Index() {

  const {addPanel} = usePanel()

  const onClick = () => {
    addPanel('first-panel', Hello)
  }
  return (
    <div>
      <Suspense fallback = {<div>Carregando</div>}>
        <Hello />
      </Suspense>
      <Button icon="git-repo" intent="danger" onClick={onClick} text="Reset" />
    </div>
  )
}
