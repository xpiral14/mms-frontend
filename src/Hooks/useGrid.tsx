import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

const gridContext = createContext<{
  reloadGrid: boolean
  setReloadGrid: Dispatch<SetStateAction<boolean>>
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

  return (
    <gridContext.Provider value={{ reloadGrid: reloadGrid, setReloadGrid }}>
      {children}
    </gridContext.Provider>
  )
}

export default GridProvider
