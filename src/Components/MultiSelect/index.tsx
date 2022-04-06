import * as React from 'react'

import {
  Button,
  FormGroup,
  FormGroupProps,
  Intent,
  MenuItem,
} from '@blueprintjs/core'
import {
  ItemPredicate,
  ItemRenderer,
  MultiSelect as BluePrintMultiSelect,
  MultiSelectProps as BluePrintMultiSelectProps,
} from '@blueprintjs/select'

import { Option } from '../../Contracts/Components/Suggest'
import { Container } from './style'
export type MultiSelectOption = Option & {
  intent?: Intent
}
const MultiSelectComponent = BluePrintMultiSelect.ofType<MultiSelectOption>()

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
}

interface MultiSelectProps
  extends Omit<
    BluePrintMultiSelectProps<MultiSelectOption>,
    'onItemSelect' | 'itemRenderer' | 'tagRenderer' | 'selectedItems'
  > {
  onChange: (
    item: MultiSelectOption,
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void
  onClear?: () => void
  onTagRemove?: (value: string | number, index: number) => void
  selectedItems?: (string | number)[]
  label?: string
  required?: boolean
  disabled?: boolean
  intent?: Intent
  maxWidth?: string | number
  formGroupProps?: FormGroupProps
  handleButtonReloadClick?: () => void
  loading?: boolean
  id: string
}

function highlightText(text: string, query: string) {
  let lastIndex = 0
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars)
  if (words.length === 0) {
    return [text]
  }
  const regexp = new RegExp(words.join('|'), 'gi')
  const tokens: React.ReactNode[] = []
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const match = regexp.exec(text)
    if (!match) {
      break
    }
    const length = match[0].length
    const before = text.slice(lastIndex, regexp.lastIndex - length)
    if (before.length > 0) {
      tokens.push(before)
    }
    lastIndex = regexp.lastIndex
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>)
  }
  const rest = text.slice(lastIndex)
  if (rest.length > 0) {
    tokens.push(rest)
  }
  return tokens
}

function areOptionsEqual(
  optionA: MultiSelectOption,
  optionB: MultiSelectOption
) {
  return optionA.label.toLowerCase() === optionB.label.toLowerCase()
}

export default function MultiSelect(props: MultiSelectProps) {
  const clearButton = props?.selectedItems?.length ? (
    <Button icon='cross' minimal={true} onClick={props.onClear} />
  ) : undefined
  const selectedOptions =
    props.selectedItems?.map((v) => props.items.find((o) => o.value === v)!) ||
    []

  const renderOption: ItemRenderer<MultiSelectOption> = (
    option,
    { modifiers, handleClick, query }
  ) => {
    if (!modifiers.matchesPredicate) {
      return null
    }
    const text = option.label
    const isSelected = props.selectedItems?.includes(option.value)
    return (
      <MenuItem
        active={isSelected}
        icon={isSelected ? 'tick' : 'blank'}
        key={option.value}
        label={option.value as any}
        onClick={handleClick}
        text={highlightText(text, query)}
        shouldDismissPopover={false}
      />
    )
  }

  const renderTag = (option: MultiSelectOption) => {
    return option?.label
  }

  const filterOption: ItemPredicate<MultiSelectOption> = (
    query,
    option,
    _index,
    exactMatch
  ) => {
    const normalizedTitle = option.label.toLowerCase()
    const normalizedQuery = query.toLowerCase()
    const normalizedOption =
      `${option.value}.${normalizedTitle}`.toLocaleLowerCase()

    if (exactMatch) {
      return normalizedTitle === normalizedQuery
    } else {
      return normalizedOption.indexOf(normalizedQuery) >= 0
    }
  }
  const isDisabled = props.loading || props.disabled
  return (
    <FormGroup
      label={props.label}
      labelFor={props.id}
      labelInfo={props.required && '*'}
      disabled={isDisabled}
      intent={props.intent}
      {...props.formGroupProps}
    >
      <Container maxWidth={props.maxWidth}>
        <MultiSelectComponent
          {...props}
          popoverProps={{
            fill: true,
          }}
          itemPredicate={filterOption}
          itemRenderer={renderOption}
          itemsEqual={areOptionsEqual}
          selectedItems={selectedOptions}
          items={props.items}
          noResults={<MenuItem disabled text='Sem resultados' />}
          onItemSelect={props.onChange}
          tagRenderer={renderTag}
          tagInputProps={{
            ...props.tagInputProps,
            disabled: isDisabled,
            separator: ' ',
            onRemove: props.onTagRemove as any,
            rightElement: clearButton,
            fill: true,
            inputProps: {
              id: props.id,
            },
            tagProps: (v, i) => ({
              intent: props.items[i]?.intent || 'none',
            }),
          }}
        />
        {Boolean(props.handleButtonReloadClick) && (
          <Button
            disabled={isDisabled}
            onClick={props.handleButtonReloadClick}
            icon={!props.loading ? 'reset' : undefined}
            loading={props.loading}
          />
        )}
      </Container>
    </FormGroup>
  )
}
