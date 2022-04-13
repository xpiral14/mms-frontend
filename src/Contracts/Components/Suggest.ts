import { IconName, Intent } from '@blueprintjs/core'

export interface SuggestProps {
  allowCreate?: boolean
  closeOnSelect?: boolean
  createdItems?: Option[]
  fill?: boolean
  option?: Option | null
  minimal?: boolean
  openOnKeyDown?: boolean
  resetOnClose?: boolean
  resetOnQuery?: boolean
  resetOnSelect?: boolean
  onChange: (
    option: Option,
    event?: React.SyntheticEvent<HTMLElement, Event> | undefined
  ) => void
  items?: Option[]
  id?: string
  label?: string
  required?: boolean
  disabled?: boolean
  itent?: Intent
  handleCreateButtonClick?: React.MouseEventHandler<HTMLElement>
}

export interface Option {
  label: string
  value: string | number,
  intent?: Intent
  icon?: IconName
}
