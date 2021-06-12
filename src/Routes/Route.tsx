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
import { isBefore } from 'date-fns'
interface RouteProps extends ReactDomRouteProps {
  component: React.FC<any>
  isPrivate?: boolean
}

const Route: FC<RouteProps> = ({
  component: Component,
  isPrivate,
  ...rest
}) => {
  const { auth, setAuth } = useAuth()
  const history = useHistory()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const storageAuth = localStorage.getItem('@auth')
    if (!auth && storageAuth) {
      const expiresAt = new Date(JSON.parse(storageAuth).expires_at)
      
      if (isBefore(new Date(), expiresAt)) {
        setAuth(JSON.parse(storageAuth))
      }
    }
    setLoading(true)
  }, [])

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
    let Layout

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

    return <Layout />
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
