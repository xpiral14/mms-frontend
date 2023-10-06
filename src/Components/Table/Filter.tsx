import { useState } from 'react'
import { Column } from '../../Contracts/Components/Table'
import InputDate from '../InputDate'
import { Checkbox, Intent } from '@blueprintjs/core'
import Button from '../Button'
import Row from '../Layout/Row'
import InputText from '../InputText'
import { parse } from 'date-fns'
import { isValidIsoDate } from '../../Util/isValidIsoDate'
import RadioGroup from '../RadioGroup'
import InputNumber from '../InputNumber'
import strToNumber from '../../Util/strToNumber'

type FilterType = 'eq' | 'in' | 'like' | 'gte' | 'lte' | 'dateq'
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

  const changeFilter = (
    filterType: FilterType,
    value: any,
    defaultKeyName?: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [(column.keyName ?? (defaultKeyName as string)) + '_' + filterType]:
        value,
    }))
  }
  const currencyFormat = /[0-9]+,[0-9]+/
  const handleFilterClick = () => {
    const formattedFilters = Object.entries(filters).reduce(
      (filterObject, [filter, filterValue]) => {
        filterObject[filter] =
          filterValue instanceof Date
            ? filterValue.toISOString().slice(0, 10)
            : Array.isArray(filterValue)
              ? filterValue?.join(',')
              : currencyFormat.test(filterValue)
                ? String(strToNumber(filterValue))
                : filterValue
        return filterObject
      },
      {} as Record<string, string>
    )
    onFilter?.(formattedFilters)
  }
  return (
    <Row className='p-2 flex flex-column'>
      {column.filters?.map((filter) => {
        const filterName = filter.keyName ?? (column.keyName as string)
        switch (filter.type) {
        case 'date':
          return (
            <InputDate
              fill
              label={filter.name}
              value={filters[filterName + '_dateeq'] as Date}
              id={'filter-' + filter.name}
              placeholder={filter.name}
              onChange={(date) => changeFilter('dateq', date, filterName)}
            />
          )
        case 'from_date':
          return (
            <InputDate
              fill
              label={filter.name}
              value={filters[filterName + '_gte'] as Date}
              id={'filter-' + filter.name}
              placeholder={filter.name}
              onChange={(date) => changeFilter('gte', date, filterName)}
            />
          )
        case 'to_date':
          return (
            <InputDate
              fill
              label={filter.name}
              value={filters[filterName + '_lte'] as Date}
              id={'filter-' + filter.name}
              placeholder={filter.name}
              onChange={(date) => changeFilter('lte', date, filterName)}
            />
          )
        case 'text':
          return (
            <InputText
              autoFocus
              label={filter.name}
              style={{ width: '100%' }}
              inputStyle={{ width: '100%' }}
              id={'filter-' + filter.name}
              value={(filters[filterName + '_like'] as string) ?? ''}
              placeholder={filter.name}
              prefix='R$'
              onChange={(event) =>
                changeFilter('like', event.target.value, filterName)
              }
            />
          )
        case 'currency':
          return (
            <InputNumber
              placeholder={filter.name}
              value={(filters[filterName + '_like'] as string) ?? ''}
              style={{ width: '100%' }}
              prefix='R$ '
              inputStyle={{ width: 'calc(100% - 35px)' }}
              onValueChange={(v) => changeFilter('like', v, filterName)}
            />
          )
        case 'checkbox':
          return filter.value?.map((option) => (
            <div key={option.value}>
              <Checkbox
                label={option.label}
                checked={(filters[filterName + '_in'] as string)?.includes(
                  option.value
                )}
                onChange={() => {
                  setFilters((prev) => {
                    const checkboxFilterName = filterName + '_in'
                    const filterValue =
                        (prev[checkboxFilterName] as string[]) ?? []
                    const optionValue = option.value
                    return {
                      ...prev,
                      [checkboxFilterName]: filterValue?.includes(optionValue)
                        ? filterValue.filter((v) => v != optionValue)
                        : [...filterValue, optionValue],
                    }
                  })
                }}
              />
            </div>
          ))
        case 'radio':
          return (
            <RadioGroup
              radios={filter.value ?? []}
              selectedValue={
                (filters[column.keyName + '_eq'] as string) ?? ''
              }
              onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                changeFilter('eq', (evt.target as any).value)
              }}
            />
          )
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
