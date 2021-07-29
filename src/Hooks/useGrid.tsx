import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'
import Paginated from '../Contracts/Models/Paginated'

const gridContext = createContext<{
  reloadGrid: boolean
  setReloadGrid: Dispatch<SetStateAction<boolean>>
  gridResponse: Paginated<any> | null
  setGridResponse: Dispatch<SetStateAction<Paginated<any> | null>>
  page: number
  setPage: Dispatch<SetStateAction<number>>
  limit: number
  setLimit: Dispatch<SetStateAction<number>>
}>(null as any)

export const useGrid = () => {
  const context = useContext(gridContext)

  if (!context) {
    throw new Error('Elemet must wrap UserDataProvider')
  }
  return context
}

const GridProvider: FC = ({ children }) => {
  const [reloadGrid, setReloadGrid] = useState<boolean>(true)
  const [response, setResponse] = useState<Paginated<any> | null>(null)
  const [limit, setLimit] = useState<number>(10)
  const [page, setPage] = useState<number>(0)

  return (
    <gridContext.Provider
      value={{
        reloadGrid: reloadGrid,
        setReloadGrid,
        gridResponse: response,
        setGridResponse: setResponse,
        page,
        setPage,
        limit,
        setLimit,
      }}
    >
      {children}
    </gridContext.Provider>
  )
}

export default GridProvider
