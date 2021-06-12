import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import { AUTH_LOCAL_STORAGE_KEY } from '../Constants'
import Auth from '../Contracts/Models/Auth'

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

  const logout = () => {
    setAuth(null)
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY)
  }
  return (
    <authContext.Provider value={{ auth: auth, setAuth: setAuth, logout }}>
      {children}
    </authContext.Provider>
  )
}

export default AuthProvider
