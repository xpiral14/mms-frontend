import React from 'react'
import { BrowserRouter, Switch, Route as ReactDomRoute } from 'react-router-dom'
import Index from '../Pages/Index'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <ReactDomRoute path='/' exact component={Index} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes

