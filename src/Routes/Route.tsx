import React, { FC, useEffect, useMemo, useState } from 'react'
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

  const ComponentWithLayout = (props: any) => {
    const Layout = useMemo(() => {
      if (loading) {
        return () => <LoadingPage />
      }

      if (auth?.user && props.isPrivate) {
        return () => (
          <PrivateLayout>
            <Component {...props} />
          </PrivateLayout>
        )
      }

      return () => (
        <PublicLayout>
          <Component {...props} />
        </PublicLayout>
      )
    }, [loading, auth?.user])

    return (
      <>
        {IS_DEVELOPMENT_MODE && <Strip variation='warning' />}
        <Layout {...props} />
      </>
    )
  }

  return (
    <ReactDomRoute
      render={(props) => (
        <ComponentWithLayout {...props} isPrivate={isPrivate} />
      )}
      {...rest}
    />
  )
}

Route.defaultProps = {
  isPrivate: false,
}
export default Route
