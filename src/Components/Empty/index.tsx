import { Colors, Icon } from '@blueprintjs/core'
import React from 'react'
import Box from '../Layout/Box'
import Container from '../Layout/Container'

const Empty = () => {
  return (
    <Container className='w-100'>
      <Box className='w-100 flex flex-center flex-column'>
        <Icon  icon='zoom-out' color={Colors.GRAY3} iconSize={30} />
        <h2 style={{ color: Colors.GRAY3, alignSelf: 'center' }} className='bp3-heading'>
          Nada por aqui ainda
        </h2>
      </Box>
    </Container>
  )
}

export default Empty