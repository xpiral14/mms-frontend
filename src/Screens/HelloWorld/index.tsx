import { Button, Card, Elevation } from '@blueprintjs/core'
import React from 'react'

function HelloWorld() {
  return (
    <Card interactive={true} elevation={Elevation.TWO}>
      <h5>
        <a href='#'>Card heading</a>
      </h5>
      <p>Card content</p>
      <Button>Submit</Button>
    </Card>
  )
}

export default HelloWorld
