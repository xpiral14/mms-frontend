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
import { useToast } from './useToast'

const authContext = createContext<{
  auth: Auth | null
  setAuth: Dispatch<SetStateAction<Auth | null>>
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
  const [auth, setAuth] = useState<Auth | null>(null)

  const { showErrorToast } = useToast()
  const logout = () => {
    setAuth(null)
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  }

  useEffect(() => {
    if (auth) {
      api.defaults.headers.authorization = `${auth.type} ${auth.token}`
      api.interceptors.response.use(
        (response) => {
          return response
        },
        (error) => {
          if (error.message.includes('Request failed with status code 401')) {
            showErrorToast({
              message: 'A sua sessão encerrou. Por favor, loge-se novamente',
            })
            logout()
          }
          throw error
        }
      )
    }
  }, [auth])

  return (
    <authContext.Provider value={{ auth: auth, setAuth: setAuth, logout }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider
