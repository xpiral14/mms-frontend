import React, { FC, useEffect, useState } from 'react'
import {
  Route as ReactDomRoute,
  RouteProps as ReactDomRouteProps,
  useHistory,
} from 'react-router-dom'
import { useAuth } from '../Hooks/useAuth'
import PrivateLayout from '../Pages/_Layouts/Private'
import PublicLayout from '../Pages/_Layouts/Public'
import LoadingPage from '../Pages/LoadingPage'
// import { isBefore } from 'date-fns'
import Strip from '../Components/Strip'
import { IS_DEVELOPMENT_MODE } from '../Constants'
interface RouteProps extends ReactDomRouteProps {
  component: React.FC<any>
  isPrivate?: boolean
}

const Route: FC<RouteProps> = ({
  component: Component,
  isPrivate,
  ...rest
}) => {
  const { auth } = useAuth()
  const history = useHistory()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (!auth && isPrivate) {
      history.push('/login')
    }

    if (auth?.user && !isPrivate) {
      history.push('/')
    }
    setLoading(false)
  }, [auth?.user])

  const ComponentWithLayout = ({ props }: any) => {
    if (loading) {
      return <LoadingPage />
    }
    let Layout: React.FunctionComponent

    if (auth?.user) {
      Layout = () => (
        <PrivateLayout>
          <Component {...props} />
        </PrivateLayout>
      )
    } else {
      Layout = () => (
        <PublicLayout>
          <Component {...props} />
        </PublicLayout>
      )
    }

    return (
      <>
        {IS_DEVELOPMENT_MODE && <Strip variation='warning' />}
        <Layout />
      </>
    )
  }

  return (
    <ReactDomRoute
      render={(props) => <ComponentWithLayout {...props} />}
      {...rest}
    />
  )
}

Route.defaultProps = {
  isPrivate: false,
}
export default Route
