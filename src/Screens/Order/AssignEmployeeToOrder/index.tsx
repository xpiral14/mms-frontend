import { Intent } from '@blueprintjs/core'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../Components/Button'
import Bar from '../../../Components/Layout/Bar'
import Container from '../../../Components/Layout/Container'
import Render from '../../../Components/Render'
import Select from '../../../Components/Select'
import { orderStatus } from '../../../Constants/Enums'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { Option } from '../../../Contracts/Components/Suggest'
import Order from '../../../Contracts/Models/Order'
import { OrderResumeProps } from '../../../Contracts/Screen/OrderResume'
import useAsync from '../../../Hooks/useAsync'
import { useAuth } from '../../../Hooks/useAuth'
import useMessageError from '../../../Hooks/useMessageError'
import { useScreen } from '../../../Hooks/useScreen'
import { useToast } from '../../../Hooks/useToast'
import { useWindow } from '../../../Hooks/useWindow'
import OrderService from '../../../Services/OrderService'

const AssignEmployeeToOrder = ({ screen }: ScreenProps) => {
  const { payload, changePayloadAttribute } = useWindow()
  const { openSubScreen } = useScreen()
  const { auth } = useAuth()
  const { showErrorToast, showSuccessToast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrder, loadOrder] = useAsync(async () => {
    try {
      const response = await OrderService.getAll(0, 1000, {
        executing_by_null: true,
      })
      setOrders(response.data.data)
    } catch (error) {
      showErrorToast('Nâo foi possível obter as ordens')
    }
  }, [])
  const { showErrorMessage: showErrormessage } = useMessageError()

  const orderOptions: Option[] = useMemo(
    () => [
      {
        value: undefined,
        label: 'Selecione uma ordem de serviço',
      },
      ...orders.map((o) => ({
        value: o.id,
        label: o.reference ?? '',
      })),
    ],
    [orders]
  )
  const order = useMemo(
    () => orders.find((o) => o.id === payload.orderId),
    [payload.orderId]
  )
  const assignEmployee = useCallback(async () => {
    try {
      await OrderService.edit({
        ...order,
        employee_id: auth?.user.id,
        status: orderStatus.IN_PROGRESS
      })
      showSuccessToast('Ordem obtida com sucesso!')
      loadOrder()
    } catch (error) {
      showErrormessage(error, 'Não foi possível obter a ordem de serviço')
    }
  }, [order])

  const openDetailScreen = useCallback(() => {
    if (!order) return
    openSubScreen<OrderResumeProps>({ id: 'order-resume' }, screen.id, {
      order,
    })
  }, [payload.orderId])
  return (
    <Container>
      <Bar>
        <Button
          text='Obter serviço'
          intent={Intent.SUCCESS}
          icon='floppy-disk'
          onClick={assignEmployee}
        />
        <Render renderIf={Boolean(order?.id)}>
          <Button  onClick={openDetailScreen} icon='search'>
          Detalhes
          </Button>

        </Render>
      </Bar>
      <div className='mt-2'>
        <Select
          handleButtonReloadClick={loadOrder}
          buttonProps={
            {
              className: 'w-full',
              style: {
                display: 'flex',
                justifyContent: 'space-between',
              },
            } as any
          }
          items={orderOptions}
          activeItem={payload.orderId}
          loading={loadingOrder}
          onItemSelect={(o) => changePayloadAttribute('orderId', o.value)}
        />
      </div>
    </Container>
  )
}

export default AssignEmployeeToOrder
