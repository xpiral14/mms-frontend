import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import api from '../Config/api'
import { AUTH_LOCAL_STORAGE_KEY } from '../Constants'
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
  const logout = () => {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
    setAuth(null)
  }


  useEffect(() => {
    if (!auth) return
    api.defaults.headers.authorization = `Bearer ${auth.token}`
    api.interceptors.response.use(
      (response) => {
        return response
      },
      (error) => {
        if (
          error?.response?.data?.messages?.includes('Unauthenticated') &&
          error.response.status === 500
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
  const { showErrormessage } = useMessageError()
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

  return (
    <authContext.Provider
      value={{ auth: auth, setAuth: setAuth, logout, company }}
    >
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider
