import React from 'react'
import { BrowserRouter, Switch, Route as ReactDomRoute } from 'react-router-dom'
import Clients from '../Pages/Clients'
import Company from '../Pages/Company'
import Estatistics from '../Pages/Estatistics'
import Login from '../Pages/Login'
import Orders from '../Pages/Orders'
import Pieces from '../Pages/Pieces'
import Vehicles from '../Pages/Vehicles'
import VehicleDetails from '../Pages/Vehicles/VehicleDetails'
import VehicleAdd from '../Pages/Vehicles/VehicleAdd'
import Route from './Route'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <ReactDomRoute path='/' exact component={Login} />
        <ReactDomRoute path='/login' component={Login} />
        <Route path='/empresa' component={Company} />
        <Route path='/clientes' component={Clients} />
        <Route path='/ordens-servico' component={Orders} />
        <Route path='/pecas' component={Pieces} />
        <Route path='/veiculos' component={Vehicles} exact />
        <Route path='/veiculos/detalhes/:vehicleId' component={VehicleDetails} exact />
        <Route path='/veiculos/adicionar' component={VehicleAdd} exact />
        <Route path='/estatisticas' component={Estatistics} />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes

