import Button from '../Button'
import Row from '../Layout/Row'
import { Popover2, Popover2Props } from '@blueprintjs/popover2'
import Table from '../Table'
import { TableProps } from '../../Contracts/Components/Table'
import { ButtonProps } from '@blueprintjs/core'

export interface TableSelectProps<T> extends TableProps<T> {
  filterableKey?: keyof T
  isPopoverOpen?: boolean
  onPopoverOpen?: () => void
  onPopoverClose?: () => void
  buttonProps?: ButtonProps
  popoverProps?: Popover2Props
}
function PopoverTableComponent<T>(
  props: TableProps<T> & { filterableKey?: keyof T }
) {
  return (
    <Row className='p-2'>
      <Table {...props} />
    </Row>
  )
}
function TableSelect<T = any>({
  isPopoverOpen,
  onPopoverClose,
  onPopoverOpen,
  buttonProps,
  popoverProps,
  ...tableProps
}: TableSelectProps<T>) {
  return (
    <Popover2
      isOpen={isPopoverOpen}
      onClose={onPopoverClose}
      placement='bottom'
      content={<PopoverTableComponent<T> {...tableProps} />}
      {...popoverProps}
    >
      <Button
        onClick={onPopoverOpen}
        text='Selecione os itens'
        {...buttonProps}
      />
    </Popover2>
  )
}

export default TableSelect
