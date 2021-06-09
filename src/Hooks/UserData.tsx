import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from 'react'
import User from '../Contracts/Models/User'

export const userDataContext = createContext<
  {
      user?: User
      setUser?: Dispatch<SetStateAction<User | undefined>>
    }
>({})

const UserDataProvider: FC = ({ children }) => {
  const [user, setUser] = useState<User>()
  return (
    <userDataContext.Provider value={{ user, setUser }}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserDataProvider
