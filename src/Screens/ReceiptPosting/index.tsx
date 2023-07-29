import { Intent } from '@blueprintjs/core'
import { format } from 'date-fns'
import React, { FC, useEffect, useMemo, useState } from 'react'
import Collapse from '../../Components/Collapse'
import InputDate from '../../Components/InputDate'
import Box from '../../Components/Layout/Box'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NumericInput from '../../Components/NumericInput'
import PaginatedTable from '../../Components/PaginatedTable'
import RegistrationButtonBar from '../../Components/RegistrationButtonBar'
import Render from '../../Components/Render'
import Select from '../../Components/Select'
import TextArea from '../../Components/TextArea'
import { ScreenStatus } from '../../Constants/Enums'
import ReceiptStatus from '../../Constants/ReceiptStatus'
import { StopLoadFunc } from '../../Contracts/Components/RegistrationButtonBarProps'
import { Option } from '../../Contracts/Components/Suggest'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Customer from '../../Contracts/Models/Customer'
import Order from '../../Contracts/Models/Order'
import Receipt from '../../Contracts/Models/Receipt'
import Valuable from '../../Contracts/Models/Valuable'
import { ReceiptPostScreenProps } from '../../Contracts/Screen/ReceiptPosting'
import { useAlert } from '../../Hooks/useAlert'
import useAsync from '../../Hooks/useAsync'
import { useGrid } from '../../Hooks/useGrid'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import CustomerService from '../../Services/CustomerService'
import OrderService from '../../Services/OrderService'
import ReceiptService from '../../Services/ReceiptService'
import currencyFormat from '../../Util/currencyFormat'
import dateFromJSON from '../../Util/dateFromJSON'
import getDateWithTz from '../../Util/getDateWithTz'
import keysToCamel from '../../Util/keysToKamel'

interface Payload extends Omit<Receipt, 'date'> {
  date: Date
}
const ReceiptPosting: FC<ReceiptPostScreenProps> = ({ screen, ...props }) => {
  const {
    payload,
    setPayload,
    setScreenStatus,
    isScreenStatusVizualize,
    isScreenStatusSeeRegisters,
    isScreenStatusEdit,
  } = useWindow<Payload>()

  const {setReloadGrid} = useGrid()
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(true)
  useEffect(() => {
    setPayload({
      ...(props.receipt ?? {}),
      date: props.receipt?.date ? new Date(props.receipt?.date) : new Date(),
    })
    setScreenStatus(ScreenStatus.NEW)
  }, [props.receipt])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [statuses, setStatuses] = useState<Valuable[]>([])
  const { showErrorToast, showSuccessToast } = useToast()

  const { openAlert } = useAlert()

  const [loadingCustomers, loadCustomers] = useAsync(async () => {
    try {
      const response = await CustomerService.getAll(0, 1000)
      setCustomers(response.data.data as Customer[])
    } catch (error) {
      showErrorToast(
        'Não foi possível carregar a lista de clientes. Por favor, tente novamente.'
      )
    }
  }, [])

  const validations: Validation[] = [
    {
      check: () => Boolean(payload.value),
      errorMessage: 'O valor da receita é obrigatório',
      inputId: screen.id + 'receipt_value',
    },
    {
      check: () => !isScreenStatusEdit || Boolean(payload.id),
      errorMessage: 'Selecione uma receita para editar',
      inputId: screen.id + 'receipt_value',
    },
  ]

  const { validate } = useValidation(validations)
  const [loadingOrders, loadOrders] = useAsync(async () => {
    try {
      const response = await OrderService.getAll(0, 1000, {})
      setOrders(response.data.data)
    } catch (error) {
      showErrorToast(
        'Não foi possível carregar as ordens de serviço. Por favor, tente novamente.'
      )
    }
  }, [])

  const [loadingStatuses, loadStatuses] = useAsync(async () => {
    try {
      const response = await ReceiptService.getReceiptStatuses()
      setStatuses(response.data.data)
      setPayload((prev) => ({ ...prev, status: ReceiptStatus.RECEIVED }))
    } catch (error) {
      showErrorToast(
        'Não foi possível listar os tipos de status, por favor tente novamente.'
      )
    }
  }, [])

  const orderOptions: Option[] = useMemo(() => {
    let formattedOrders = orders
    if (payload.customerId) {
      formattedOrders = formattedOrders.filter(
        (o) => o.customer_id === payload.customerId
      )
    }

    return formattedOrders.map((o) => ({
      label: `${o.reference} ${
        o.date ? `(${getDateWithTz(o.date).toLocaleDateString()})` : ''
      }`,
      value: o.id,
    }))
  }, [orders, payload?.customerId])
  const customerOptions: Option[] = useMemo(
    () =>
      customers.map((c) => ({
        label: c.name,
        value: c.id,
      })),
    [customers]
  )

  const cleanPayload = () => {
    setPayload({
      date: new Date(),
    })
  }
  const createReceipt = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      await ReceiptService.save({
        ...payload,
        date: format(payload.date ?? new Date(), 'yyyy-MM-dd'),
      })
      cleanPayload()
      showSuccessToast('Receita lançada com sucesso!')
    } catch (error) {
      showErrorToast(
        'Não foi possível salvar a receita. Por favor, tente novamente.'
      )
    } finally {
      stopLoad()
    }
  }

  const updateReceipt = async (stopLoad: StopLoadFunc) => {
    if (!validate()) return

    try {
      await ReceiptService.update({
        ...payload,
        date: format(payload.date ?? new Date(), 'yyyy-MM-dd'),
      })
      showSuccessToast('Receita atualizada com sucesso!')
      setScreenStatus(ScreenStatus.VISUALIZE)
    } catch (error) {
      showErrorToast(
        'Não foi possível salvar a receita. Por favor, tente novamente.'
      )
    } finally {
      stopLoad()
    }
  }

  return (
    <Container style={{ height: 'calc(100% - 50px)' }}>
      <RegistrationButtonBar
        handleSaveButtonOnClick={
          isScreenStatusEdit ? updateReceipt : createReceipt
        }
        handleDeleteButtonOnClick={async () => {
          const onConfirm = async () => {
            try {
              await ReceiptService.delete(payload.id!)
              showSuccessToast('Receita removida com sucesso!')
              cleanPayload()
              setReloadGrid(true)
              if (isScreenStatusEdit) {
                setScreenStatus(ScreenStatus.SEE_REGISTERS)
              }
            } catch (error) {
              showErrorToast(
                'Não foi possível remover a receita. Por favor, tente novamente.'
              )
            }
          }
          openAlert({
            text: 'Tem certeza que deseja deletetar esta receita?',
            intent: Intent.DANGER,
            icon: 'warning-sign',
            onConfirm,
          })
        }}
      />
      <Render renderIf={!isScreenStatusSeeRegisters}>
        <Box className='w-100'>
          <Row>
            <Select
              items={customerOptions}
              label='Cliente'
              handleButtonReloadClick={loadCustomers}
              loading={loadingCustomers}
              onChange={(o) =>
                setPayload((prev) => ({
                  ...prev,
                  customerId: o.value as number,
                }))
              }
              buttonProps={
                {
                  style: {
                    maxWidth: 250,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                } as any
              }
              disabled={isScreenStatusVizualize}
              activeItem={payload.customerId}
            />
            <Select
              label='Ordem de serviço'
              items={orderOptions}
              loading={loadingOrders}
              handleButtonReloadClick={loadOrders}
              disabled={isScreenStatusVizualize}
              onChange={(o) =>
                setPayload((prev) => ({
                  ...prev,
                  orderId: o.value as number,
                  customerId: orders.find((or) => or.id === o.value)
                    ?.customer_id,
                }))
              }
              activeItem={payload?.orderId}
            />
            <Select
              label='Status do lançamento'
              items={statuses.map((v) => ({ value: v.id, label: v.name }))}
              loading={loadingStatuses}
              handleButtonReloadClick={loadStatuses}
              disabled={isScreenStatusVizualize}
              onChange={(o) =>
                setPayload((prev) => ({
                  ...prev,
                  status: o.value as ReceiptStatus,
                  date:
                    o.value === ReceiptStatus.RECEIVABLE &&
                    prev.date! > new Date()
                      ? prev.date
                      : new Date(),
                }))
              }
              activeItem={payload?.status}
            />
            <NumericInput
              required
              disabled={isScreenStatusVizualize}
              id={screen.id + 'receipt_value'}
              label='Valor'
              value={payload.value ?? 0}
              selectAllOnFocus
              onValueChange={(v) => setPayload((p) => ({ ...p, value: v }))}
            />
            <InputDate
              id={screen.id + 'receipt_date'}
              disabled={isScreenStatusVizualize}
              label='Data do lançamento'
              value={payload.date as Date}
              onChange={(d) => setPayload((p) => ({ ...p, date: d }))}
              maxDate={
                payload.status !== ReceiptStatus.RECEIVABLE
                  ? new Date()
                  : undefined
              }
            />
          </Row>
          <Row>
            <TextArea
              disabled={isScreenStatusVizualize}
              label='Descrição'
              style={{ flex: 1 }}
              id={screen.id + 'receipt_description'}
              value={payload.description ?? ''}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, description: e.target.value }))
              }
            />
          </Row>
        </Box>
        <Box>
          <Row>
            <Collapse
              title='Detalhes'
              isCollapsed={isDetailCollapsed}
              onChange={() => setIsDetailCollapsed((prev) => !prev)}
            >
              <Row>
                <TextArea
                  disabled={isScreenStatusVizualize}
                  label='Anotações'
                  style={{ flex: 1 }}
                  id={screen.id + 'receipt_description'}
                  value={payload.annotations ?? ''}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...prev,
                      annotations: e.target.value,
                    }))
                  }
                />
              </Row>
            </Collapse>
          </Row>
        </Box>
      </Render>
      <Render renderIf={isScreenStatusSeeRegisters}>
        <Row className='h-100'>
          <PaginatedTable
            height='100%'
            request={ReceiptService.getAll}
            columns={[
              {
                name: 'Status',
                formatText: (r) =>
                  statuses.find((s) => s.id === r?.status)?.name,
              },
              {
                name: 'Valor',
                keyName: 'value',
                formatText: (r) => currencyFormat(r?.value),
              },
              {
                name: 'Data do lançamento',
                formatText: (r) =>
                  dateFromJSON(r?.date as string)?.toLocaleDateString(
                    undefined,
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    }
                  ),
              },
              {
                name: 'Descrição',
                formatText: (r) => {
                  const text = r?.description?.toString().slice(0, 50)

                  if ((r?.description as string)?.length > 50)
                    return text + '...'

                  return text
                },
              },
            ]}
            onRowSelect={(r) => {
              setPayload({
                ...keysToCamel(r),
                date: dateFromJSON(r.date),
              })
            }}
            containerProps={{
              style: {
                flex: 1,
              },
            }}
            isSelected={(r) => r.id === payload.id}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default ReceiptPosting
