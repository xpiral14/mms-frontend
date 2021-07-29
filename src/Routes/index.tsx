import React from 'react'
import { BrowserRouter, Switch } from 'react-router-dom'
import Index from '../Pages/Index'
import LoginPage from '../Pages/Login'
import Route from './Route'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/' isPrivate exact component={Index} />
        <Route path='/login' exact component={LoginPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes

