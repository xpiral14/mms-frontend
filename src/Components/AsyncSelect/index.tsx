import { useCallback, useEffect, useMemo, useState } from 'react'
import Select, { SelectProps } from '../Select'
import { Option } from '../../Contracts/Components/Suggest'
import { useToast } from '../../Hooks/useToast'
import debounce from '../../Util/debounce'

export type AsyncSearchFunction<T = any> = (
  query: string | null
) => Promise<Option<T>[]>
export interface AsyncSelectProps extends SelectProps {
  searchFunction: AsyncSearchFunction
}
function AsyncSelect<T = any>({ searchFunction, ...props }: AsyncSelectProps) {
  const [options, setOptions] = useState([] as Option[])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState<string | null>(null)
  const { showErrorToast } = useToast()
  const getOptions = useCallback(
    async (query: string | null) => {
      try {
        setLoading(true)
        setOptions(await searchFunction(query))
        setQuery(query)
      } catch (error) {
        showErrorToast('Não foi possível obter os dados')
      } finally {
        setLoading(false)
      }
    },
    [searchFunction]
  )
  const debounceSearchFunction = useMemo(
    () =>
      debounce(getOptions, 300),
    [getOptions]
  )
  useEffect(() => {
    debounceSearchFunction(null)
  }, [debounceSearchFunction])

  return (
    <Select<T>
      {...props}
      onQueryChange={debounceSearchFunction}
      items={options}
      loading={loading}
      handleButtonReloadClick={() => getOptions(query)}
    />
  )
}

export default AsyncSelect
