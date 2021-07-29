import { createContext, useContext } from 'react'
export const serviceContext = createContext(null as any)



export const useService = () => {
  const context = useContext(serviceContext)

  if (!context) {
    throw new Error('Context is null')
  }

  return context
}

export default function ServiceContext({
  children,
}: React.PropsWithChildren<any>) {
  return (
    <serviceContext.Provider value={{}}>{children}</serviceContext.Provider>
  )
}
