import React from 'react'
import styled from 'styled-components'
import { AnchorButton, Button, ButtonGroup } from '@blueprintjs/core'

const BarContainer = styled.div`
  background-color: aliceblue;
`

const RegistrationButtonBar: React.FC = (): JSX.Element => {
  return (
    <BarContainer>
      <ButtonGroup minimal={true}>
        <Button icon='database'>Queries</Button>
        <Button icon='function'>Functions</Button>
        <AnchorButton rightIcon='caret-down'>Options</AnchorButton>
      </ButtonGroup>
    </BarContainer>
  )
}

export default RegistrationButtonBar
