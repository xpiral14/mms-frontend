import { Intent, TextArea } from '@blueprintjs/core'
import React, { useEffect, useMemo, useState } from 'react'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Select from '../../../Components/Select'
import {
  DiscountType,
  orderStatus,
  OrderStatusByValue,
  PersonType,
  ScreenStatus,
} from '../../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  StopLoadFunc,
} from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { Option } from '../../../Contracts/Components/Suggest'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Costumer from '../../../Contracts/Models/Costumer'
import Order from '../../../Contracts/Models/Order'
import OrderServiceModel from '../../../Contracts/Models/OrderService'
import { useAlert } from '../../../Hooks/useAlert'
import useAsync from '../../../Hooks/useAsync'
import { useGrid } from '../../../Hooks/useGrid'
import { useScreen } from '../../../Hooks/useScreen'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import OrderService from '../../../Services/OrderService'
import { Body, Container, Header } from './style'
import Button from '../../../Components/Button'
import InputText from '../../../Components/InputText'
import Render from '../../../Components/Render'
import InputDate from '../../../Components/InputDate'
import Collapse from '../../../Components/Collapse'
import Row from '../../../Components/Layout/Row'
import { OrderServiceDetailsProps } from '../../../Contracts/Screen/OrderServiceDetails/OrderServiceDetailsProps'
import { OrderPartDetailsProps } from '../../../Contracts/Screen/OrderPartDetails'
import OrderPart from '../../../Contracts/Models/OrderPart'
import Box from '../../../Components/Layout/Box'
import { format, isBefore } from 'date-fns'
import InputGroup from '../../../Components/InputGroup'
import keysToCamel from '../../../Util/keysToKamel'

const orderStatusOptions: Option[] = [
  {
    value: orderStatus.PENDING,
    label: 'Pendente',
    intent: Intent.NONE,
  },
  {
    value: orderStatus.EXECUTING,
    label: 'Executando',
    intent: Intent.PRIMARY,
  },
  {
    value: orderStatus.EXECUTED,
    label: 'Executada',
    intent: Intent.SUCCESS,
  },
  {
    value: orderStatus.CANCELED,
    label: 'Cancelada',
    intent: Intent.DANGER,
  },
]

const discountTypeOptions: Option[] = [
  {
    value: DiscountType.PERCENT,
    label: 'Porcentagem',
    icon: 'percentage',
  },
  {
    value: DiscountType.VALUE,
    label: 'Valor',
    icon: 'dollar',
  },
]

type OrderPayload = {
  id?: number
  serviceIds: number[]
  partIds: number[]
  costumerId?: number
  description?: string
  date: Date
  status: orderStatus
  reference: string
  services?: OrderServiceModel[]
  parts?: OrderPart[]
  validity?: Date
  serviceDiscountType?: DiscountType
  serviceDiscount?: number
  productDiscountType?: DiscountType
  productDiscount?: number
}
const OrderServiceCostumer: React.FC<ScreenProps> = ({ screen }) => {
  const [costumers, setCostumer] = useState<Costumer[]>([])
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)

  const costumerOptions = useMemo(() => {
    const normalized = {
      options: [] as Option[],
      keyValue: {} as { [x: number]: Option },
    }
    costumers.forEach((costumer) => {
      const option = {
        label: costumer.name,
        value: costumer.id,
      }
      normalized.options.push(option)

      normalized.keyValue[option.value] = option
    })
    return normalized
  }, [costumers])

  const [loadingCostumers, loadCostumers] = useAsync(async () => {
    try {
      const response = await CostumerService.getAll(1, 100)
      setCostumer(response.data.data as Costumer[])
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter lista de clientes',
      })
    }
  }, [])

  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<OrderPayload>()
  const isStatusVisualize = Boolean(screenStatus === ScreenStatus.VISUALIZE)
  useEffect(() => {
    changePayload('date', new Date())
  }, [])
  const changePayload = (key: keyof typeof payload, value: any) => {
    setPayload((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const createValidation = (keyName: keyof typeof payload) => () => {
    const value = (payload as any)[keyName]

    if (Array.isArray(value)) {
      return Boolean(value.length)
    }

    if (typeof value === 'object') {
      return Boolean(Object.keys(value).length)
    }

    return Boolean(value)
  }

  const validations: Validation[] = [
    {
      check: createValidation('costumerId'),
      errorMessage: 'Escolha o cliente',
      inputId: `${screen.id}-select-costumer`,
    },
  ]
  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()
  const { openSubScreen } = useScreen()

  const reloadAllScreenData = () => {
    loadCostumers()
    setReloadGrid(true)
  }

  const saveAction = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const requestPayload = {
        date: payload?.date ? format(payload?.date, 'yyyy-MM-dd') : null,
        reference: payload.reference,
        costumerId: payload.costumerId!,
        description: payload?.description,
        partIds: [] as number[],
        serviceIds: [] as number[],
        status: payload.status,
        validity: payload?.date
          ? format(payload?.date, 'yyyy-MM-dd HH:mm:ss')
          : null,
        serviceDiscountType: payload.serviceDiscountType,
        serviceDiscount: payload.serviceDiscount,
        productDiscount: payload.productDiscount,
        productDiscountType: payload.productDiscountType,
      }
      const response = await OrderService.create(requestPayload)
      const orderId = response.data.data.id
      setReloadGrid(true)
      changePayload('id', orderId)
      if (payload.services) {
        Promise.all(
          payload.services?.map((orderService) =>
            OrderService.addService(orderId, orderService)
          )
        )
      }

      if (payload.parts) {
        Promise.all(
          payload.parts?.map((orderPart) =>
            OrderService.addPart(orderId, orderPart)
          )
        )
      }
      showSuccessToast({
        message: 'Ordem de serviço criada com sucesso!',
      })
      setScreenStatus(ScreenStatus.VISUALIZE)
      setPayload({})
    } catch (error: any) {
      let message = 'Erro ao criar ordem serviço. Por favor, tente novamente.'
      if (error?.response?.data?.data?.messages) {
        message = error?.response?.data?.data?.messages
      }
      showErrorToast({
        message: message,
      })
    } finally {
      stopLoad()
    }
  }

  const updateAction = async (stopLoad: StopLoadFunc) => {
    const order = {
      id: payload.id,
      date: payload?.date ? format(payload?.date, 'yyyy-MM-dd') : null,
      reference: payload.reference,
      costumerId: payload.costumerId!,
      description: payload?.description,
      status: payload.status,
    } as Order

    try {
      await OrderService.edit(order)

      showSuccessToast({
        message: 'Ordem editada com sucesso.',
      })
      setReloadGrid(true)
      setScreenStatus(ScreenStatus.VISUALIZE)
    } catch (error: any) {
      let errorMessage =
        'Erro ao tentar editar a ordem. Por favor tente novamente.'
      if (error?.response?.data?.data?.messages) {
        errorMessage = error?.response?.data?.data?.messages
      }
      showErrorToast({
        message: errorMessage,
      })
    } finally {
      stopLoad()
    }
  }
  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? saveAction : updateAction,
    handleDeleteButtonOnClick: async () => {
      const onConfirm = async () => {
        try {
          await OrderService.delete(payload.id!)
          showSuccessToast({
            message: 'A ordem foi deletada com sucesso',
          })

          setReloadGrid(true)
        } catch (error) {
          showErrorToast({
            message: 'Não foi possível deletar a ordem especificada',
          })
        }
      }

      openAlert({
        text: 'Você tem certeza que deseja deletar a ordem de serviço?',
        onConfirm,
        intent: Intent.DANGER,
      })
    },
    handleReloadScreenOnClick: reloadAllScreenData,
  }

  const toOrderModel = (data: Partial<OrderPayload>) => {
    return {
      id: data.id!,
      costumer_id: data.costumerId,
      employee_id: data.costumerId,
      status: '1',
    } as Order
  }

  const openOrderDetailsScreen = () => {
    const orderServiceDetailsProps: OrderServiceDetailsProps = {
      onSave(orderServices, screen) {
        screen.close()
        changePayload('services', orderServices)
      },
    }

    if (payload.id) {
      orderServiceDetailsProps.order = toOrderModel(payload)
    }

    if (payload?.services?.length) {
      orderServiceDetailsProps.selectedOrderServices = payload.services
    }

    openSubScreen<OrderServiceDetailsProps>(
      {
        id: 'order-service-details',
        contentSize: '770 430',
        headerTitle: 'Serviços da ordem',
      },
      screen.id,
      orderServiceDetailsProps
    )
  }

  const openOrderPartScreen = () => {
    const orderPartDetailsProps: OrderPartDetailsProps = {
      onSave(orderParts, screen) {
        screen.close()
        changePayload('parts', orderParts)
      },
    }

    if (payload.id) {
      orderPartDetailsProps.order = toOrderModel(payload)
    }

    if (payload?.services?.length) {
      orderPartDetailsProps.selectedOrderParts = payload.parts
    }

    openSubScreen<OrderPartDetailsProps>(
      {
        id: 'order-part-details',
        contentSize: '770 430',
        headerTitle: 'Produtos da ordem',
      },
      screen.id,
      orderPartDetailsProps
    )
  }

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body>
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <Box className='flex flex-justify-end'>
            <Button
              intent='primary'
              title='Mostrar serviços'
              rightIcon='wrench'
              onClick={openOrderDetailsScreen}
              disabled={isStatusVisualize}
            >
              Serviços
            </Button>
            <Button
              intent='primary'
              title='Mostrar produtos'
              rightIcon='barcode'
              disabled={isStatusVisualize}
              onClick={openOrderPartScreen}
            >
              Produtos
            </Button>
          </Box>
          <Box className='flex align-center flex-wrap'>
            <Render renderIf={Boolean(payload.id)}>
              <InputText
                label='Número da ordem'
                id={`${screen.id}-order-id`}
                value={payload.id ?? ''}
                disabled={isStatusVisualize}
                readOnly
              />
            </Render>

            <InputText
              label='Referência'
              id={`${screen.id}-reference`}
              value={payload.reference ?? ''}
              onChange={(event) =>
                changePayload('reference', event.target.value)
              }
              disabled={isStatusVisualize}
            />
            <InputDate
              label='Data'
              id={`${screen.id}-order-date`}
              value={payload.date}
              onChange={(selectedDate) => changePayload('date', selectedDate)}
              disabled={isStatusVisualize}
            />
            <InputDate
              intent={
                payload?.validity
                  ? isBefore(payload.validity, new Date())
                    ? Intent.WARNING
                    : Intent.NONE
                  : Intent.NONE
              }
              label='Validade da nota'
              id={`${screen.id}-order-date`}
              value={payload.validity}
              onChange={(selectedDate) =>
                changePayload('validity', selectedDate)
              }
              disabled={isStatusVisualize}
            />
            <Select
              onChange={(item) => changePayload('status', item.value)}
              label='Status da ordem'
              activeItem={payload?.status}
              items={orderStatusOptions}
              disabled={isStatusVisualize}
            />
            <Select
              handleButtonReloadClick={loadCostumers}
              loading={loadingCostumers}
              required
              allowCreate
              activeItem={payload?.costumerId}
              onChange={(option) => changePayload('costumerId', option.value)}
              defaultButtonText='Escolha um profissional'
              label='Cliente'
              items={costumerOptions.options}
              handleCreateButtonClick={(query) => {
                openSubScreen(
                  {
                    id: 'costumer-register',
                    contentSize: '700px 350px',
                  },
                  screen.id,
                  {
                    defaultCostumer: {
                      name: query,
                      personType: PersonType.PHYSICAL,
                    },
                    defaultScreenStatus: ScreenStatus.NEW,
                  }
                )
              }}
              buttonProps={
                {
                  id: `${screen.id}-select-costumer`,
                  style: {
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                  },
                } as any
              }
              disabled={screenStatus === ScreenStatus.VISUALIZE}
            />
          </Box>
          <Collapse
            title={
              <Box>
                <Row
                  style={{
                    flex: 1,
                    justifyContent: 'space-between',
                  }}
                >
                  <span> Informações básicas </span>
                </Row>
              </Box>
            }
            isCollapsed={isDetailsCollapsed}
            onChange={() => setIsDetailsCollapsed((prev) => !prev)}
          >
            <Box>
              <Row>
                <InputGroup
                  id=''
                  disabled={isStatusVisualize}
                  label='Desconto nos produtos'
                  leftIcon={
                    payload.productDiscountType
                      ? payload.productDiscountType === DiscountType.PERCENT
                        ? 'percentage'
                        : 'dollar'
                      : undefined
                  }
                  value={
                    payload?.productDiscount
                      ? String(payload?.productDiscount)
                      : ''
                  }
                  onChange={(e: any) =>
                    changePayload('productDiscount', +e.target.value)
                  }
                  selectProps={{
                    activeItem: payload.productDiscountType,
                    onChange: (item) =>
                      changePayload('productDiscountType', item.value),
                    intent: Intent.PRIMARY,
                    items: discountTypeOptions,
                  }}
                />
                <InputGroup
                  id=''
                  disabled={isStatusVisualize}
                  leftIcon={
                    payload.serviceDiscountType
                      ? payload.serviceDiscountType === DiscountType.PERCENT
                        ? 'percentage'
                        : 'dollar'
                      : undefined
                  }
                  label='Desconto nos serviços'
                  value={
                    payload?.serviceDiscount
                      ? String(payload?.serviceDiscount)
                      : ''
                  }
                  onChange={(e: any) =>
                    changePayload('serviceDiscount', +e.target.value)
                  }
                  selectProps={{
                    intent: Intent.PRIMARY,
                    activeItem: payload.serviceDiscountType,
                    onChange: (item) =>
                      changePayload('serviceDiscountType', item.value),
                    items: discountTypeOptions,
                  }}
                />
              </Row>

              <Row>
                <TextArea
                  value={payload?.description || ''}
                  onChange={(e) => {
                    changePayload('description', e.currentTarget.value)
                  }}
                  placeholder='Digite a observação'
                  disabled={screenStatus === ScreenStatus.VISUALIZE}
                  growVertically={false}
                  style={{ flex: 1 }}
                />
              </Row>
            </Box>
          </Collapse>
        </Render>
        <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
          <Box className='h-100'>
            <Row className='h-100'>
              <PaginatedTable
                containerProps={{
                  className: 'styled-scroll',
                  style: {
                    overflowY: 'scroll',
                    width: '100%',
                  },
                }}
                rowKey={(row) => row.id + row.created_at}
                columns={[
                  {
                    id: 1,
                    name: 'Status',
                    keyName: 'status',

                    formatText: (text) =>
                      OrderStatusByValue[+text],
                  },
                  {
                    id: 1,
                    name: 'Observação',
                    keyName: 'description',
                    withoutValueText: 'Não possui observação',
                  },
                  {
                    id: 1,
                    name: 'Criado em',
                    keyName: 'date',
                    formatText: (date) => {
                      return date
                        ? new Date(date).toLocaleDateString('pt-BR')
                        : '-'
                    },
                  },
                ]}
                isSelected={(row) => row.id === payload?.id}
                request={OrderService.getAll as any}
                onRowSelect={(row) => {
                  const cameledObject = keysToCamel({
                    ...row,
                  })
                  setPayload({
                    ...cameledObject,
                    validity: row.validity ? new Date(row.validity) : undefined,
                    date: row.date ? new Date(row.date) : undefined,
                  })
                }}
                height='calc(100% - 50px)'
              />
            </Row>
          </Box>
        </Render>
      </Body>
    </Container>
  )
}

export default OrderServiceCostumer
