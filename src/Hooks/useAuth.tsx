import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import api from '../Config/api'
import { AUTH_LOCAL_STORAGE_KEY } from '../Constants'
import { Permissions } from '../Constants/Enums'
import Auth from '../Contracts/Models/Auth'
import Company from '../Contracts/Models/Company'
import CompanyService from '../Services/CompanyService'
import useMessageError from './useMessageError'
import { useToast } from './useToast'

const authContext = createContext<{
  auth: Auth | null
  setAuth: Dispatch<SetStateAction<Auth | null>>
  company: Company | null
  logout: () => void
  hasSomeOfPermissions: (permissions: Permissions[]) => boolean
  hasAllPermissions: (permissions: Permissions[]) => boolean
  hasPermission: (permission: Permissions) => boolean
    }>(null as any)

export const useAuth = () => {
  const context = useContext(authContext)

  if (!context) {
    throw new Error('Elemet must wrap UserDataProvider')
  }
  return context
}

const AuthProvider: FC = ({ children }) => {
  const [auth, setAuth] = useState<Auth | null>(() => {
    const authStorage = localStorage.getItem('@auth')
    return authStorage ? (JSON.parse(authStorage) as Auth) : null
  })

  const [company, setCompany] = useState<Company | null>(null)
  const { showErrorToast } = useToast()
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    setAuth(null)
  }, [])

  useEffect(() => {
    if (!auth) return
    api.defaults.headers.Authorization = `Bearer ${auth.token}`
    api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (
          Object.values(error?.response?.data?.data?.messages ?? {}).includes('Unauthenticated') &&
          error.response.status === 401
        ) {
          showErrorToast({
            message: 'A sua sessão encerrou. Por favor, loge-se novamente',
          })
          logout()
        }
        throw error
      }
    )

    localStorage.setItem('@auth', JSON.stringify(auth))
  }, [auth])
  const { showErrorMessage: showErrormessage } = useMessageError()
  useEffect(() => {
    if (!auth?.user?.id) return

    const getCompany = async () => {
      try {
        const response = await CompanyService.get()
        setCompany(response.data.data)
      } catch (error) {
        showErrormessage(
          error,
          'Não foi possível obter os dados da empresa. Por favor, tente novamente.'
        )
      }
    }
    getCompany()
  }, [auth?.user.id])

  const hasAllPermissions = useCallback(
    (permissions: Permissions[]) =>
      permissions.every((permission) =>
        auth?.user?.role?.permissions.some(
          (userPermission) => userPermission.id === permission
        )
      ),
    []
  )

  const hasSomeOfPermissions = useCallback(
    (permissions: Permissions[]) =>
      permissions.some((permission) =>
        auth?.user?.role?.permissions.some(
          (userPermission) => userPermission.id === permission
        )
      ),
    [auth?.user?.role?.permissions]
  )

  const hasPermission = useCallback(
    (permission: Permissions) =>
      auth?.user.role?.permissions.some(
        (userPermission) => userPermission.id === permission
      ) ?? false,
    [auth?.user.role?.permissions]
  )

  const value = useMemo(
    () => ({
      auth: auth,
      setAuth: setAuth,
      logout,
      company,
      hasAllPermissions,
      hasSomeOfPermissions,
      hasPermission,
    }),
    [auth, setAuth, logout, company, hasPermission]
  )

  return <authContext.Provider value={value}>{children}</authContext.Provider>
}

export default AuthProvider
