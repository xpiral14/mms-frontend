import React, { FC, useContext, useEffect } from 'react'
import {
  Route as ReactDomRoute,
  RouteProps as ReactDomRouteProps,
  useHistory,
} from 'react-router-dom'
import { userDataContext } from '../Hooks/UserData'

interface RouteProps extends ReactDomRouteProps {
  component: React.FC<any>
}

const Route: FC<RouteProps> = ({ component: Component, ...rest }) => {
  const { user } = useContext(userDataContext)
  const history = useHistory()

  useEffect(() => {
    if (!user) {
      history.push('/login')
    }
  }, [user])

  return (
    <ReactDomRoute
      render={(props) => (
        <Component {...props} />
      )}
      {...rest}
    />
  )
}
export default Route
