/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-constant-condition */
import * as React from 'react'

import {
  Button,
  ButtonProps,
  FormGroup,
  Intent, Menu,
  MenuItem,
} from '@blueprintjs/core'
import {
  ItemListRenderer,
  ItemPredicate,
  ItemRenderer,
  Select as CreateSelect,
  SelectProps as BluePrintSelectProps,
} from '@blueprintjs/select'

import { Option } from '../../Contracts/Components/Suggest'
import { useMemo } from 'react'
import Render from '../Render'
import { CSSProperties } from 'styled-components'
import { Wrapper } from './styles'

export interface SelectProps
  extends Partial<Omit<BluePrintSelectProps<Option>, 'activeItem'>> {
  allowCreate?: boolean
  onChange?: (
    item: Option,
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined,
  ) => void
  handleCreateButtonClick?: (query: string) => void
  id?: string
  label?: string
  required?: boolean
  disabled?: boolean
  intent?: Intent
  buttonProps?: ButtonProps & { style?: CSSProperties }
  defaultButtonText?: string
  loading?: boolean
  handleButtonReloadClick?: () => Promise<void> | void
  activeItem?: number | string
  buttonWidth?: number | string
}

const OptionSelect = CreateSelect.ofType<Option>()

function areOptionsEqual(optionA: Option, optionB: Option) {
  return optionA.label.toLowerCase() === optionB.label.toLowerCase()
}

export default function Select({
  allowCreate = false,
  activeItem,
  ...props
}: SelectProps) {
  const activeOption = useMemo(() => {
    if (activeItem === null || activeItem === undefined) return null
    return props.items?.find((o) => o.value === activeItem)
  }, [activeItem, props.items])
  const renderCreateOptionOption = (query: string, active: boolean) => (
    <MenuItem
      icon='add'
      text={`Criar "${query}"`}
      selected={active}
      onClick={() => props.handleCreateButtonClick?.(query)}
      shouldDismissPopover={false}
    />
  )

  function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
  }

  const maybeCreateNewItemRenderer = allowCreate
    ? renderCreateOptionOption
    : undefined

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

  const filterOption: ItemPredicate<Option> = (
    query,
    option,
    _index,
    exactMatch,
  ) => {
    const normalizedTitle = option.label.toLowerCase()
    const normalizedQuery = query.toLowerCase()

    if (exactMatch) {
      return normalizedTitle === normalizedQuery
    } else {
      return `${option.value}. ${normalizedTitle}`.indexOf(normalizedQuery) >= 0
    }
  }
  const renderOption: ItemRenderer<Option> = (
    option,
    { handleClick, modifiers, query },
  ) => {
    if (!modifiers.matchesPredicate) {
      return null
    }
    const text = option.label
    return (
      <MenuItem
        intent={option.intent}
        selected={activeOption?.value === option.value}
        disabled={modifiers.disabled}
        key={option.value}
        icon={option?.icon}
        onClick={handleClick}
        text={highlightText(text, query)}
      />
    )
  }

  const renderMenu: ItemListRenderer<Option> = ({
    items,
    itemsParentRef,
    query,
    renderItem,
  }) => {
    const renderedItems = items.map(renderItem).filter((item) => item != null)
    return (
      <Menu
        ulRef={itemsParentRef}
        style={{
          maxHeight: 100,
          overflowY: 'scroll',
        }}
        className='styled-scroll'
      >
        <Render renderIf={Boolean(query)}>
          <MenuItem
            disabled={true}
            text={`Encontrado ${renderedItems.length} items com a pesquisa "${query}"`}
          />
        </Render>
        {renderedItems}
      </Menu>
    )
  }
  return (
    <FormGroup
      label={props.label}
      labelInfo={props.required && '*'}
      disabled={props.disabled}
      intent={props.intent}
      labelFor={props.id}
      style={props.buttonWidth ? {
        width: props.buttonWidth
      } : undefined}
    >
      <Wrapper className='d-flex gap-2'>
        <OptionSelect
          resetOnSelect
          filterable
          popoverProps={{
            fill: true,
            boundary: 'window',
          }}
          itemPredicate={filterOption}
          items={props.items || []}
          itemListRenderer={renderMenu}
          itemRenderer={renderOption}
          inputProps={{
            placeholder: 'Pesquisar...',
          }}
          createNewItemFromQuery={(() => {
          }) as any}
          createNewItemRenderer={maybeCreateNewItemRenderer}
          itemsEqual={areOptionsEqual}
          noResults={<MenuItem disabled={true} text='Sem resultados' />}
          onItemSelect={props?.onChange as any}
          scrollToActiveItem
          {...props}
        >
          <Button
            id={props.id}
            icon={activeOption?.icon}
            loading={props.loading}
            rightIcon='caret-down'
            alignText='left'
            intent={props.intent ?? activeOption?.intent}
            disabled={props.disabled}
            {...props?.buttonProps}
            className='flex-1 w-100'
          >
            {activeOption?.label ||
                props.defaultButtonText ||
                'Escolha um item'}
          </Button>
        </OptionSelect>
        {Boolean(props.handleButtonReloadClick) && (
          <Button
            disabled={props.disabled}
            onClick={props.handleButtonReloadClick}
            icon={!props.loading ? 'reset' : undefined}
            loading={props.loading}
          />
        )}
      </Wrapper>
    </FormGroup>
  )
}
