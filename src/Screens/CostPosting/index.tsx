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
import { CostType, ScreenStatus } from '../../Constants/Enums'
import { StopLoadFunc } from '../../Contracts/Components/RegistrationButtonBarProps'
import { Option } from '../../Contracts/Components/Suggest'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Costumer from '../../Contracts/Models/Costumer'
import Order from '../../Contracts/Models/Order'
import Cost from '../../Contracts/Models/Cost'
import Valuable from '../../Contracts/Models/Valuable'
import { CostPostScreenProps } from '../../Contracts/Screen/CostPosting'
import { useAlert } from '../../Hooks/useAlert'
import useAsync from '../../Hooks/useAsync'
import { useGrid } from '../../Hooks/useGrid'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import CostumerService from '../../Services/CostumerService'
import OrderService from '../../Services/OrderService'
import CostService from '../../Services/CostService'
import currencyFormat from '../../Util/currencyFormat'
import dateFromJSON from '../../Util/dateFromJSON'
import getDateWithTz from '../../Util/getDateWithTz'
import keysToCamel from '../../Util/keysToKamel'
import useMessageError from '../../Hooks/useMessageError'
import InputText from '../../Components/InputText'

interface Payload extends Omit<Cost, 'date'> {
  date: Date
}
const CostPosting: FC<CostPostScreenProps> = ({ screen, ...props }) => {
  const {
    payload,
    setPayload,
    setScreenStatus,
    isScreenStatusVizualize,
    isScreenStatusSeeRegisters,
    isScreenStatusEdit,
  } = useWindow<Payload>()

  const { setReloadGrid } = useGrid()
  const [isDetailCollapsed, setIsDetailCollapsed] = useState(true)
  useEffect(() => {
    setPayload({
      ...(props.cost ?? {}),
      date: props.cost?.date ? new Date(props.cost?.date) : new Date(),
    })
    setScreenStatus(ScreenStatus.NEW)
  }, [props.cost])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Costumer[]>([])
  const [costTypes, setCostTypes] = useState<Valuable[]>([])
  const { showErrorToast, showSuccessToast } = useToast()

  const { openAlert } = useAlert()
  const { showErrorMessage: showErrormessage } = useMessageError()
  const [loadingCustomers, loadCustomers] = useAsync(async () => {
    try {
      const response = await CostumerService.getAll(0, 1000)
      setCustomers(response.data.data as Costumer[])
    } catch (error) {
      showErrorToast(
        'Não foi possível carregar a lista de clientes. Por favor, tente novamente.'
      )
    }
  }, [])

  const validations: Validation[] = [
    {
      check: () => Boolean(payload.value),
      errorMessage: 'O valor do custo é obrigatório',
      inputId: screen.id + 'cost_value',
    },
    {
      check: () => !isScreenStatusEdit || Boolean(payload.id),
      errorMessage: 'Selecione um custo para editar',
      inputId: screen.id + 'cost_value',
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

  const [loadingCostTypes, loadCostTypes] = useAsync(async () => {
    try {
      const response = await CostService.getCostTypes()
      setCostTypes(response.data.data)
      setPayload((prev) => ({ ...prev, type: CostType.OTHERS }))
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
        (o) => o.costumer_id === payload.customerId
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
      value: 0,
    })
  }
  const createCost = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      await CostService.save({
        ...payload,
        date: format(payload.date ?? new Date(), 'yyyy-MM-dd'),
      })
      cleanPayload()
      showSuccessToast('Receita lançada com sucesso!')
    } catch (error) {
      showErrormessage(
        error,
        'Não foi possível salvar o custo. Por favor, tente novamente.',
        { showOn: 'toast' }
      )
    } finally {
      stopLoad()
    }
  }

  const updateCost = async (stopLoad: StopLoadFunc) => {
    if (!validate()) return

    try {
      await CostService.update({
        ...payload,
        date: format(payload.date ?? new Date(), 'yyyy-MM-dd'),
      })
      showSuccessToast('Receita atualizada com sucesso!')
      setScreenStatus(ScreenStatus.VISUALIZE)
    } catch (error) {
      showErrormessage(
        error,
        'Não foi possível salvar o custo. Por favor, tente novamente.',
        { showOn: 'toast' }
      )
    } finally {
      stopLoad()
    }
  }

  return (
    <Container style={{ height: 'calc(100% - 50px)' }}>
      <RegistrationButtonBar
        handleSaveButtonOnClick={isScreenStatusEdit ? updateCost : createCost}
        handleDeleteButtonOnClick={async () => {
          const onConfirm = async () => {
            try {
              await CostService.delete(payload.id!)
              showSuccessToast('Receita removida com sucesso!')
              cleanPayload()
              setReloadGrid(true)
              if (isScreenStatusEdit) {
                setScreenStatus(ScreenStatus.SEE_REGISTERS)
              }
            } catch (error) {
              showErrorToast(
                'Não foi possível remover o custo. Por favor, tente novamente.'
              )
            }
          }
          openAlert({
            text: 'Tem certeza que deseja deletetar este custo?',
            intent: Intent.DANGER,
            icon: 'warning-sign',
            onConfirm,
          })
        }}
      />
      <Render renderIf={!isScreenStatusSeeRegisters}>
        <Box className='w-100'>
          <Render renderIf={Boolean(payload.id)}>
            <Row>
              <InputText
                label='Código do custo'
                id={screen.id + 'cost_id'}
                readOnly
                value={payload.id}
              />
            </Row>
          </Render>
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
                    ?.costumer_id,
                }))
              }
              activeItem={payload?.orderId}
            />
            <Select
              label='Categoria do custo'
              items={costTypes.map((v) => ({ value: v.id, label: v.name }))}
              loading={loadingCostTypes}
              handleButtonReloadClick={loadCostTypes}
              disabled={isScreenStatusVizualize}
              onChange={(o) =>
                setPayload((prev) => ({
                  ...prev,
                  type: o.value as CostType,
                }))
              }
              activeItem={payload?.type}
            />
            <NumericInput
              required
              disabled={isScreenStatusVizualize}
              id={screen.id + 'cost_value'}
              label='Valor'
              value={payload.value ?? 0}
              selectAllOnFocus
              onValueChange={(v, vS) =>
                setPayload((p) => ({ ...p, value: vS as any }))
              }
            />
            <InputDate
              id={screen.id + 'cost_date'}
              disabled={isScreenStatusVizualize}
              label='Data do lançamento'
              value={payload.date as Date}
              onChange={(d) => setPayload((p) => ({ ...p, date: d }))}
              maxDate={new Date()}
            />
          </Row>
          <Row>
            <TextArea
              disabled={isScreenStatusVizualize}
              label='Descrição'
              style={{ flex: 1 }}
              id={screen.id + 'cost_description'}
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
                  id={screen.id + 'cost_description'}
                  value={payload.annotation ?? ''}
                  onChange={(e) =>
                    setPayload((prev) => ({
                      ...prev,
                      annotation: e.target.value,
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
            request={CostService.getAll}
            columns={[
              {
                name: 'Tipo',
                formatText: (r) =>
                  costTypes.find((s) => s.id === r?.type)?.name,
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

export default CostPosting
