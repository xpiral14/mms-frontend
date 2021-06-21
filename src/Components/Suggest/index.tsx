/* eslint-disable no-constant-condition */
import * as React from 'react'

import { FormGroup, MenuItem } from '@blueprintjs/core'
import {
  ItemPredicate,
  ItemRenderer,
  Suggest as CreateSuggest,
} from '@blueprintjs/select'
import { Option, SuggestProps } from '../../Contracts/Components/Suggest'


const DefaultSuggest = CreateSuggest.ofType<Option>()

const renderOption: ItemRenderer<Option> = (
  option,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null
  }
  const text = option.label
  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={option.value}
      onClick={handleClick}
      text={highlightText(text, query)}
    />
  )
}

export const filterOption: ItemPredicate<Option> = (
  query,
  option,
  _index,
  exactMatch
) => {
  const normalizedTitle = option.label.toLowerCase()
  const normalizedQuery = query.toLowerCase()

  if (exactMatch) {
    return normalizedTitle === normalizedQuery
  } else {
    return option.label.indexOf(normalizedQuery) >= 0
  }
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

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
}

function areOptionsEqual(optionA: Option, optionB: Option) {
  // Compare only the titles (ignoring case) just for simplicity.
  return optionA.label.toLowerCase() === optionB.label.toLowerCase()
}


export default function Suggest(props: SuggestProps) {
  const renderCreateOption = props.allowCreate
    ? (query: string, active: boolean) => (
      <MenuItem
        icon='add'
        text={`Create "${query}"`}
        active={active}
        onClick={props.handleCreateButtonClick}
        shouldDismissPopover={false}
      />
    )
    : undefined
  const { allowCreate, ...flags } = props

  const maybeCreateNewItemRenderer = allowCreate ? renderCreateOption : null
  const renderInputValue = (option: Option) => option.label
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.itent}
      labelFor={props.id}
    >
      <DefaultSuggest
        fill
        itemPredicate={filterOption}
        itemRenderer={renderOption}
        createNewItemRenderer={maybeCreateNewItemRenderer as any}
        inputValueRenderer={renderInputValue}
        itemsEqual={areOptionsEqual}
        noResults={<MenuItem disabled={true} text='Sem resultados' />}
        onItemSelect={props.onChange}
        items={props.items || []}
        {...flags}
      />
    </FormGroup>
  )
}
