import { Icon, Intent } from '@blueprintjs/core'
import React, { useEffect, useMemo, useState } from 'react'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Select from '../../../Components/Select'
import {
  DiscountType,
  orderStatus,
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
import Employee from '../../../Contracts/Models/Employee'
import Order from '../../../Contracts/Models/Order'
import { ReceiptPostProps } from '../../../Contracts/Screen/ReceiptPosting'
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
import EmployeeService from '../../../Services/EmployeeService'
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
import TextArea from '../../../Components/TextArea'
import { Column, Row as TableRow } from '../../../Contracts/Components/Table'
import { OrderResumeProps } from '../../../Contracts/Screen/OrderResume'
import getDateWithTz from '../../../Util/getDateWithTz'
import OrderStatus from '../../../Contracts/Models/OrderStatus'
import capitalize from '../../../Util/capitalize'
import ReceiptStatus from '../../../Constants/ReceiptStatus'

const discountTypeOptions: Option[] = [
  {
    value: undefined,
    label: 'Selecionar desconto',
  },

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
  employeeId?: number
  totalPrice: number
}

type OrderFilter = {
  customerName?: string
  status?: string
  validity?: Date
}
const OrderServiceCostumer: React.FC<ScreenProps> = ({ screen }) => {
  const [costumers, setCostumer] = useState<Costumer[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)
  const [filter, setFilter] = useState<OrderFilter>({
    customerName: '',
    status: '',
    validity: undefined,
  })

  const formattedFilter = useMemo(
    () => ({
      ...filter,
      validity: filter.validity
        ? format(filter.validity, 'yyyy-MM-dd')
        : undefined,
    }),
    [filter]
  )

  const changeFilter = (object: Partial<OrderFilter>) =>
    setFilter((prev) => ({
      ...prev,
      ...object,
    }))

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
  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        label: employee.name,
        value: employee.id,
      })),
    [employees]
  )

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

  const [loadingOrderStatuses, loadOrderStatuses] = useAsync(async () => {
    try {
      const response = await OrderService.getOrderStatuses()
      setOrderStatuses(
        response.data.data.map((o) => ({ ...o, name: capitalize(o.name) }))
      )
    } catch (error) {
      showErrorToast({
        message:
          'Erro ao obter lista de status de ordem de serviço. Por favor, tente novamente',
      })
    }
  }, [])

  const [loadingEmployees, loadEmployees] = useAsync(async () => {
    try {
      const response = await EmployeeService.getAll(1, 100)
      setEmployees(response.data.data as Employee[])
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
    setPayload({
      date: new Date(),
    })
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
    loadEmployees()
    setReloadGrid(true)
  }

  const showReceiptPostingScreen = async (orderId: number) => {
    const totalPrice = await OrderService.getTotalPriceOfOrder(orderId)
    const receiptsTotal = (
      await OrderService.getOrderReceipts(orderId)
    ).data.data.reduce((carry, receipt) => carry + receipt.value, 0)
    if (totalPrice === 0) {

      openAlert({
        text: 'A ordem de serviço não possui serviços nem produtos com valor',
        intent: Intent.WARNING,
        icon: 'warning-sign',
        confirmButtonText: 'Entendi',
      })
      return
    }
    if (receiptsTotal >= totalPrice) {
      return
    }

    const onConfirm = async () => {
      openSubScreen<ReceiptPostProps>(
        {
          id: 'receipt-posting',
          forceOpen:  true,
          contentSize: '900px 256px'
        },
        screen.id,
        {
          receipt: {
            status: ReceiptStatus.RECEIVED,
            value: totalPrice - receiptsTotal,
            date: new Date(),
            orderId: payload.id,
            customerId: payload.costumerId,
            description: payload?.reference
              ? 'Lançamento para a ordem ' + payload?.reference
              : undefined,
          },
        }
      )
    }
    openAlert({
      text: 'A ordem está no status aprovado, você deseja lançar o recebimento?',
      onConfirm: onConfirm,
    })
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
        employeeId: payload?.employeeId,
      }
      const response = await OrderService.create(requestPayload)
      const orderId = response.data.data.id
      setReloadGrid(true)
      changePayload('id', orderId)
      if (payload.services) {
        await Promise.all(
          payload.services?.map((orderService) =>
            OrderService.addService(orderId, orderService)
          )
        )
      }

      if (payload.parts) {
        await Promise.all(
          payload.parts?.map((orderPart) =>
            OrderService.addPart(orderId, orderPart)
          )
        )
      }
      showSuccessToast({
        message: 'Ordem de serviço criada com sucesso!',
      })

      if (payload.status === orderStatus.DONE) {
        showReceiptPostingScreen(orderId)
      }

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
    if (!validate()) {
      stopLoad()
      return
    }
    const order = {
      id: payload.id,
      date: payload?.date ? format(payload?.date, 'yyyy-MM-dd') : null,
      reference: payload.reference,
      costumerId: payload.costumerId!,
      description: payload?.description,
      status: payload.status,
      validity: payload?.date
        ? format(payload?.date, 'yyyy-MM-dd HH:mm:ss')
        : null,
      serviceDiscountType: payload.serviceDiscountType ?? null,
      serviceDiscount:
        payload.serviceDiscountType === DiscountType.PERCENT
          ? payload.serviceDiscount
            ? payload.serviceDiscount / 100
            : null
          : payload.serviceDiscount ?? null,
      productDiscount:
        payload.productDiscountType === DiscountType.PERCENT
          ? payload.productDiscount
            ? payload.productDiscount / 100
            : null
          : payload.productDiscount ?? null,
      productDiscountType: payload.productDiscountType,
      employeeId: payload.employeeId,
    }

    try {
      await OrderService.edit(order)

      showSuccessToast('Ordem editada com sucesso.')

      if (payload.status === orderStatus.DONE) {
        showReceiptPostingScreen(payload.id!)
      }
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
      date: data.date,
      validity: data.validity,
      reference: data.reference,
      description: data.description,
      product_discount: data.productDiscount,
      product_discount_type: data.productDiscountType,
      service_discount: data.serviceDiscount,
      service_discount_type: data.serviceDiscountType,
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

  const openOrderResumeScreen = () => {
    const orderResumeProps: OrderResumeProps = {
      onClose(screen) {
        screen.close()
      },
      order: toOrderModel(payload),
    }
    openSubScreen<OrderServiceDetailsProps>(
      {
        id: 'order-resume',
        contentSize: '770 430',
      },
      screen.id,
      orderResumeProps
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

  const isProductDiscountTypePercent =
    payload.productDiscountType === DiscountType.PERCENT

  const isServiceDiscountTypePercent =
    payload.serviceDiscountType === DiscountType.PERCENT
  const columns: Column[] = [
    {
      name: 'Status',
      keyName: 'status',
      formatText: (row) =>
        orderStatuses.find((o) => o.id === row?.status)?.name,
      style: {
        width: '30%',
      },
    },
    {
      name: 'Observação',
      keyName: 'description',
    },
    {
      name: 'Criado em',
      keyName: 'date',
      formatText: (row) => {
        return row?.date
          ? getDateWithTz(new Date(row.date)).toLocaleDateString('pt-BR')
          : '-'
      },
    },
  ]
  const onRowSelect = (row: TableRow): void => {
    const cameledObject = keysToCamel({
      ...row,
    })
    setPayload({
      ...cameledObject,
      validity: row.validity ? new Date(row.validity) : undefined,
      date: row.date ? new Date(row.date) : undefined,
      productDiscount:
        row.product_discount_type === DiscountType.PERCENT
          ? +(row.product_discount ?? 0) * 100
          : row.product_discount,
      serviceDiscount:
        row.service_discount_type === DiscountType.PERCENT
          ? +(row.service_discount ?? 0) * 100
          : row.service_discount,
      employeeId: row.executing_by,
    })
  }

  const orderStatusOptions = useMemo(
    () => orderStatuses.map((o) => ({ value: o.id, label: o.name })),
    [orderStatuses]
  )
  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body>
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <Box className='flex flex-justify-end'>
            <Render renderIf={Boolean(payload.id)}>
              <Button
                intent='primary'
                title='Mostrar resumo da ordem'
                rightIcon='th-list'
                onClick={openOrderResumeScreen}
              >
                Mostrar resumo
              </Button>
            </Render>
            <Button
              intent='primary'
              title='Mostrar serviços'
              rightIcon='wrench'
              onClick={openOrderDetailsScreen}
              disabled={Boolean(!payload.id && isStatusVisualize)}
            >
              Serviços
            </Button>

            <Button
              intent='primary'
              title='Mostrar produtos'
              rightIcon='barcode'
              disabled={!payload.id && isStatusVisualize}
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
              loading={loadingOrderStatuses}
              handleButtonReloadClick={loadOrderStatuses}
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
                    minWidth: '150px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  },
                } as any
              }
              disabled={screenStatus === ScreenStatus.VISUALIZE}
            />
            <Select
              handleButtonReloadClick={loadEmployees}
              loading={loadingEmployees}
              required
              allowCreate
              activeItem={payload?.employeeId}
              onChange={(option) => changePayload('employeeId', option.value)}
              defaultButtonText='Escolha um profissional'
              label='Funcionário'
              items={employeeOptions}
              handleCreateButtonClick={(query) => {
                openSubScreen(
                  {
                    id: 'employees-register',
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
                    minWidth: '150px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: 250,
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                  },
                } as any
              }
              disabled={screenStatus === ScreenStatus.VISUALIZE}
            />
          </Box>
          <Collapse
            title={<h6> Informações básicas </h6>}
            isCollapsed={isDetailsCollapsed}
            onChange={() => setIsDetailsCollapsed((prev) => !prev)}
          >
            <Box>
              <Row>
                <InputGroup
                  type='number'
                  id={screen.id + 'product_discount_value'}
                  disabled={Boolean(
                    isStatusVisualize || !payload.productDiscountType
                  )}
                  label='Desconto nos produtos'
                  max={isProductDiscountTypePercent ? 100 : undefined}
                  leftIcon={
                    payload.productDiscountType
                      ? isProductDiscountTypePercent
                        ? 'percentage'
                        : 'dollar'
                      : undefined
                  }
                  value={
                    payload?.productDiscount
                      ? String(payload?.productDiscount)
                      : ''
                  }
                  onChange={(e: any) => {
                    let value = +e.target.value
                    if (isProductDiscountTypePercent && value > 100) {
                      value = 100
                    }

                    changePayload('productDiscount', value)
                  }}
                  selectProps={{
                    id: screen.id + 'select_product_discount_value',
                    disabled: isStatusVisualize,
                    activeItem: payload.productDiscountType,
                    onChange: (item) => {
                      const productDiscountType = item.value as DiscountType

                      setPayload((prev) => {
                        let productDiscount = prev.productDiscount

                        if (
                          isProductDiscountTypePercent &&
                          prev.productDiscount! > 100
                        ) {
                          productDiscount = 100
                        }

                        if (!productDiscountType) {
                          productDiscount = undefined
                        }
                        return {
                          ...prev,
                          productDiscountType,
                          productDiscount,
                        }
                      })
                    },
                    intent: Intent.PRIMARY,
                    items: discountTypeOptions,
                  }}
                />
                <InputGroup
                  id=''
                  disabled={Boolean(
                    isStatusVisualize || !payload.serviceDiscountType
                  )}
                  type='number'
                  max={isServiceDiscountTypePercent ? 100 : undefined}
                  leftIcon={
                    payload.serviceDiscountType
                      ? isServiceDiscountTypePercent
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
                  onChange={(e: any) => {
                    let value = +e.target.value

                    if (isServiceDiscountTypePercent && value > 100) {
                      value = 100
                    }
                    changePayload('serviceDiscount', value)
                  }}
                  selectProps={{
                    disabled: isStatusVisualize,
                    intent: Intent.PRIMARY,
                    activeItem: payload.serviceDiscountType,
                    onChange: (item) => {
                      const serviceDiscountType = item.value as DiscountType

                      setPayload((prev) => {
                        let serviceDiscount = prev.serviceDiscount

                        if (
                          isServiceDiscountTypePercent &&
                          prev.serviceDiscount! > 100
                        ) {
                          serviceDiscount = 100
                        }

                        if (!serviceDiscountType) {
                          serviceDiscount = undefined
                        }
                        return {
                          ...prev,
                          serviceDiscountType,
                          serviceDiscount,
                        }
                      })
                    },
                    items: discountTypeOptions,
                  }}
                />
              </Row>

              <Row>
                <TextArea
                  id={screen.id + 'order-description'}
                  label='Descrição'
                  value={payload?.description || ''}
                  onChange={(e) => {
                    changePayload('description', e.currentTarget.value)
                  }}
                  maxLength={150}
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
          <Row style={{ flex: 1 }}>
            <Box>
              <Row className='align-center d-flex flex-between'>
                <div>
                  <Icon icon='filter' />
                  Filtros
                </div>
                <Button icon='search' onClick={() => setReloadGrid(true)}>
                  Filtrar
                </Button>
              </Row>
              <Row
                className='mt-3'
                style={{
                  maxWidth: 250,
                  flexDirection: 'column',
                }}
              >
                <InputText
                  id={screen.id + 'costumer_filter'}
                  value={filter.customerName}
                  label='Nome do cliente'
                  onChange={(e) =>
                    changeFilter({
                      customerName: e.target.value,
                    })
                  }
                />
                <InputDate
                  label='Validade da nota'
                  id={screen.id + 'filter-date-validatiom'}
                  value={filter?.validity}
                  onChange={(validity) => changeFilter({ validity: validity })}
                />
                <Select
                  label='Status da ordem'
                  onItemSelect={(i) => {
                    changeFilter({
                      status: i.value as string,
                    })
                  }}
                  activeItem={filter.status}
                  items={orderStatusOptions}
                />
              </Row>
            </Box>
            <Box style={{ flex: 1 }}>
              <Row>
                <PaginatedTable
                  containerProps={{
                    className: 'styled-scroll',
                    style: {
                      width: '100%',
                    },
                  }}
                  filters={formattedFilter}
                  rowKey={(row) => row.id + row.created_at}
                  columns={columns}
                  isSelected={(row) => row.id === payload?.id}
                  request={OrderService.getAll as any}
                  onRowSelect={onRowSelect}
                  height='100%'
                />
              </Row>
            </Box>
          </Row>
        </Render>
      </Body>
    </Container>
  )
}

export default OrderServiceCostumer
