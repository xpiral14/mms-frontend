import { useState } from 'react'
import { Column } from '../../Contracts/Components/Table'
import InputDate from '../InputDate'
import { Checkbox, Intent } from '@blueprintjs/core'
import Button from '../Button'
import Row from '../Layout/Row'
import InputText from '../InputText'
import { parse } from 'date-fns'
import { isValidIsoDate } from '../../Util/isValidIsoDate'

type FilterType = 'eq' | 'in' | 'like' | 'gte' | 'lte'
type FilterProps<T = Record<string, any>> = {
  column: Column<T>
  onFilter?: (filters: Record<string, string>) => void
  filter: Record<string, string>
}

function Filter<T = Record<string, any>>({
  column,
  onFilter,
  filter: defaultFilter,
}: FilterProps<T>) {
  const [filters, setFilters] = useState(() =>
    Object.entries(defaultFilter ?? {}).reduce(
      (acc, [filterName, filterValue]) => {
        acc[filterName] = isValidIsoDate(filterValue)
          ? parse(filterValue, 'yyyy-MM-dd', new Date())
          : filterValue?.includes(',')
            ? filterValue.split(',')
            : filterValue
        return acc
      },
      {} as Record<string, string | Date | string[]>
    )
  )

  const changeFilter = (filterType: FilterType, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [(column.keyName as string) + '_' + filterType]: value,
    }))
  }

  const handleFilterClick = () => {
    const formattedFilters = Object.entries(filters).reduce(
      (filterObject, [filter, filterValue]) => {
        filterObject[filter] =
          filterValue instanceof Date
            ? filterValue.toISOString().slice(0, 10)
            : Array.isArray(filterValue)
              ? filterValue?.join(',')
              : filterValue
        return filterObject
      },
      {} as Record<string, string>
    )
    onFilter?.(formattedFilters)
  }
  return (
    <Row className='p-2 d-flex flex-column'>
      {column.filters?.map((filter) => {
        switch (filter.type) {
        case 'date':
          return (
            <InputDate
              fill
              value={filters[(column.keyName as string) + '_eq'] as Date}
              id={'filter-' + filter.name}
              placeholder={filter.name}
              onChange={(date) => changeFilter('eq', date)}
            />
          )
        case 'from_date':
          return (
            <InputDate
              fill
              value={filters[(column.keyName as string) + '_gte'] as Date}
              id={'filter-' + filter.name}
              placeholder={filter.name}
              onChange={(date) => changeFilter('gte', date)}
            />
          )
        case 'text':
          return (
            <InputText
              style={{ width: '100%' }}
              inputStyle={{ width: '100%' }}
              id={'filter-' + filter.name}
              value={
                (filters[
                  ((column.keyName ?? filter.keyName) as string) + '_like'
                ] as string) ?? ''
              }
              placeholder={filter.name}
              onChange={(event) => changeFilter('like', event.target.value)}
            />
          )
        case 'checkbox':
          return filter.value?.map((option) => (
            <div key={option.value}>
              <Checkbox
                label={option.label}
                checked={(
                    filters[column.keyName + '_in'] as string
                )?.includes(option.value)}
                onChange={() => {
                  const filterName = column.keyName + '_in'
                  setFilters((prev) => {
                    const filterValue = (prev[filterName] as string[]) ?? []
                    const optionValue = option.value
                    return {
                      ...prev,
                      [filterName]: filterValue?.includes(optionValue)
                        ? filterValue.filter((v) => v != optionValue)
                        : [...filterValue, optionValue],
                    }
                  })
                }}
              />
            </div>
          ))
        }
      })}

      <Row>
        <Button
          icon='search'
          fill
          intent={Intent.SUCCESS}
          text='Pesquisar'
          onClick={handleFilterClick}
        />
      </Row>
    </Row>
  )
}

export default Filter
