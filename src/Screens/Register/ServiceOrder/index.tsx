import React, { useEffect, useMemo, useState } from 'react'
import { ButtonGroup, Intent } from '@blueprintjs/core'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Select from '../../../Components/ScreenComponents/Select'
import {
  DiscountType,
  orderStatus,
  Permissions,
  PersonType,
  ScreenStatus,
} from '../../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  ReportProps,
  StopLoadFunc,
} from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { Option } from '../../../Contracts/Components/Suggest'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Customer from '../../../Contracts/Models/Customer'
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
import CustomerService from '../../../Services/CustomerService'
import OrderService from '../../../Services/OrderService'
import EmployeeService from '../../../Services/EmployeeService'
import { Body, Container, Header } from './style'
import Button from '../../../Components/Button'
import InputText from '../../../Components/ScreenComponents/InputText'
import Render from '../../../Components/Render'
import Collapse from '../../../Components/Collapse'
import Row from '../../../Components/Layout/Row'
import { OrderServiceDetailsProps } from '../../../Contracts/Screen/OrderServiceDetails/OrderServiceDetailsProps'
import { OrderProductDetailsProps } from '../../../Contracts/Screen/OrderProductDetails'
import OrderProduct from '../../../Contracts/Models/OrderProduct'
import Box from '../../../Components/Layout/Box'
import { format, isBefore } from 'date-fns'
import InputGroup from '../../../Components/InputGroup'
import TextArea from '../../../Components/TextArea'
import { Column, Row as TableRow } from '../../../Contracts/Components/Table'
import { OrderResumeProps } from '../../../Contracts/Screen/OrderResume'
import getDateWithTz from '../../../Util/getDateWithTz'
import OrderStatus from '../../../Contracts/Models/OrderStatus'
import capitalize from '../../../Util/capitalize'
import ReceiptStatus from '../../../Constants/ReceiptStatus'
import { useAuth } from '../../../Hooks/useAuth'
import useMessageError from '../../../Hooks/useMessageError'
import Bar from '../../../Components/Layout/Bar'
import Switch from '../../../Components/ScreenComponents/Switch'
import InputDate from '../../../Components/ScreenComponents/InputDate'
import currencyFormat from '../../../Util/currencyFormat'

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
  productIds: number[]
  customer_id?: number
  description?: string
  date: Date
  status: orderStatus
  reference: string
  services?: OrderServiceModel[]
  products?: OrderProduct[]
  validity?: Date
  service_discout_type?: DiscountType
  service_discount?: number
  product_discountType?: DiscountType
  product_discount?: number
  employeeId?: number
  totalPrice: number
  sendNotificationWhenConcluded?: boolean
}
const reports = [
  {
    columns: [
      {
        name: '',
        formatText: (_, index) => (index ?? 0) + 1 + '°',
      },
      {
        name: 'Referencia',
        keyName: 'product_reference',
        filters: [
          {
            keyName: 'product_reference',
            name: 'Referência',
            type: 'text',
          },
        ],
      },
      {
        keyName: 'product_name',
        name: 'Produto',
        filters: [
          {
            keyName: 'product_name',
            name: 'Produto',
            type: 'text',
          },
        ],
      },
      {
        name: 'Quantidade total vendida',
        formatText: (r) => `${r.total_quantity_sold} ${r.unit_name}`,
      },
      {
        name: 'Valor total vendida',
        formatText: (r) => `R$ ${r.total_value_sold}`,
      },
    ],
    downloadable: true,
    reportRequestOptions: [
      {
        mimeType: 'application/csv',
        reportType: 'csv',
        name: 'Rank de venda de produtos',
        responseType: 'text',
      },
    ],
    request: OrderService.rankOfProductsBySale,
    text: 'Rank de venda de produtos',
  },
] as ReportProps[]
const ServiceOrder: React.FC<ScreenProps> = ({ screen }) => {
  const { hasPermission, auth } = useAuth()
  const [customers, setCustomer] = useState<Customer[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)

  const customerOptions = useMemo(() => {
    const normalized = {
      options: [] as Option[],
      keyValue: {} as { [x: number]: Option },
    }
    customers.forEach((customer) => {
      const option = {
        label: customer.name,
        value: customer.id,
      }
      normalized.options.push(option)

      normalized.keyValue[option.value] = option
    })
    return normalized
  }, [customers])
  const employeeOptions = useMemo(
    () =>
      employees.map((employee) => ({
        label: employee.name,
        value: employee.id,
      })),
    [employees]
  )
  const {
    payload,
    setPayload,
    screenStatus,
    setScreenStatus,
    changePayloadAttribute,
  } = useWindow<
    Omit<Order, 'date' | 'validity'> & { date: Date; validity: Date }
  >()

  const [loadingCustomers, loadCustomers] = useAsync(async () => {
    try {
      const response = await CustomerService.getAll(1, 100)
      setCustomer(response.data.data as Customer[])
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
      if (!hasPermission(Permissions.READ_EMPLOYEE)) return
      const response = await EmployeeService.getAll(1, 100)
      setEmployees(response.data.data as Employee[])
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter lista de clientes',
      })
    }
  }, [])

  const [loadingReference] = useAsync(async () => {
    if (screenStatus !== ScreenStatus.NEW) return

    try {
      const reference = (await OrderService.getNextReference()).data.data
        .reference
      changePayloadAttribute('reference', reference ?? '')
    } catch (error) {
      showErrorMessage(
        error,
        'Ops! Não foi possível preencher a referência de forma automática'
      )
    }
  }, [screenStatus])

  const isStatusVisualize = Boolean(screenStatus === ScreenStatus.SEE_REGISTERS)
  useEffect(() => {
    setPayload({
      date: new Date(),
      employee_id: hasPermission(Permissions.READ_EMPLOYEE)
        ? undefined
        : auth?.user?.id,
    })
  }, [])

  const createValidation = (keyName: keyof Order) => () => {
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
      check: createValidation('customer_id'),
      errorMessage: 'Escolha o cliente',
      inputId: `${screen.id}-select-customer`,
    },
    {
      check: () =>
        !payload.product_discount ||
        Boolean(payload.id) ||
        Boolean(payload.order_products?.length),
      errorMessage: 'Não há produtos para que se possa haver desconto',
    },
    {
      check: () =>
        !payload.service_discount ||
        Boolean(payload.id) ||
        Boolean(payload.order_services?.length),
      errorMessage: 'Não há serviços para que se possa haver desconto',
    },
  ]
  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()
  const { openSubScreen } = useScreen()
  const { showErrorMessage } = useMessageError()
  const reloadAllScreenData = () => {
    loadCustomers()
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
          forceOpen: true,
          contentSize: '900px 256px',
        },
        screen.id,
        {
          receipt: {
            status: ReceiptStatus.RECEIVED,
            value: totalPrice - receiptsTotal,
            date: new Date(),
            orderId: payload.id,
            customerId: payload.customer_id,
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
        ...payload,
        date: payload?.date ? payload.date.toISOString() : null,
        productIds: [] as number[],
        serviceIds: [] as number[],
        status: payload.status,
        validity: payload?.date ? payload.date.toISOString() : null,
      }
      const response = await OrderService.create(requestPayload)
      const orderId = response.data.data.id
      setReloadGrid(true)
      changePayloadAttribute('id', orderId)
      try {
        if (payload.order_services?.length) {
          await Promise.all(
            (payload.order_services ?? [])?.map((orderService) =>
              OrderService.addService(orderId, orderService)
            )
          )
        }
      } catch (error) {
        showErrorMessage(
          error,
          'Ocorreu um erro ao tentar salvar os produtos. Por favor, tente novamente.'
        )
      }

      try {
        if (payload.order_products?.length) {
          await Promise.all(
            payload.order_products?.map((orderProduct) =>
              OrderService.addProduct(orderId, orderProduct)
            )
          )
        }
      } catch (error) {
        showErrorMessage(
          error,
          'Ocorreu um erro ao tentar salvar os serviços. Por favor, tente novamente.'
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
      ...payload,
      date: payload?.date ? format(payload?.date, 'yyyy-MM-dd') : null,
      validity: payload?.date
        ? format(payload?.date, 'yyyy-MM-dd HH:mm:ss')
        : null,
      service_discount:
        payload.service_discount_type === DiscountType.PERCENT
          ? payload.service_discount
            ? payload.service_discount
            : null
          : payload.service_discount ?? null,
      product_discount:
        payload.product_discount_type === DiscountType.PERCENT
          ? payload.product_discount
            ? payload.product_discount
            : null
          : payload.product_discount ?? null,
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
    handleNewButtonOnClick: () => {
      setScreenStatus(ScreenStatus.NEW)
      setPayload({
        date: new Date(),
        status: orderStatus.DONE,
      })
    },
    reports,
  }

  const openOrderDetailsScreen = () => {
    const orderServiceDetailsProps: OrderServiceDetailsProps = {
      onSave(orderServices, screen) {
        screen.close()
        changePayloadAttribute('order_services', orderServices)
      },
    }

    if (payload.id) {
      orderServiceDetailsProps.order = {
        ...payload,
        date: payload.date?.toISOString(),
        validity: payload.date?.toISOString(),
      }
    }

    if (payload?.order_services?.length) {
      orderServiceDetailsProps.selectedOrderServices = payload.order_services
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
      order: {
        ...payload,
        date: payload.date?.toISOString(),
        validity: payload.date?.toISOString(),
      },
    }
    openSubScreen<OrderServiceDetailsProps>(
      {
        id: 'order-resume',
      },
      screen.id,
      orderResumeProps
    )
  }

  const openOrderProductScreen = () => {
    const orderProductDetailsProps: OrderProductDetailsProps = {
      onSave(orderProducts, screen) {
        changePayloadAttribute('order_products', orderProducts)
        screen.close()
      },
    }

    if (payload.id) {
      orderProductDetailsProps.order = {
        ...payload,
        date: payload.date?.toISOString(),
        validity: payload.date?.toISOString(),
      }
    }

    if (payload?.order_products?.length) {
      orderProductDetailsProps.selectedOrderProducts = payload.order_products
    }

    openSubScreen<OrderProductDetailsProps>(
      {
        id: 'order-product-details',
        contentSize: '770 430',
        headerTitle: 'Produtos da ordem',
      },
      screen.id,
      orderProductDetailsProps
    )
  }

  const isProductDiscountTypePercent =
    payload.product_discount_type === DiscountType.PERCENT

  const isServiceDiscountTypePercent =
    payload.service_discount_type === DiscountType.PERCENT
  const columns: Column<
    Order & {
      employee_name?: string
      customer_name?: string
      invoicing?: string
    }
  >[] = [
    {
      name: 'Referência',
      style: {
        maxWidth: 50,
      },
      filters: [
        {
          name: 'Referência',
          type: 'text',
        },
      ],
      keyName: 'reference',
      sortable: true,
    },
    {
      name: 'Faturamento',
      keyName: 'invoicing',
      formatText: (r) => currencyFormat(r?.invoicing),
    },
    {
      name: 'Funcionário',
      keyName: 'employee_name',
      sortable: true,
      style: { whiteSpace: 'nowrap' },
      filters: [
        {
          name: 'Funcionário',
          type: 'text',
        },
      ],
    },
    {
      name: 'Cliente',
      style: { whiteSpace: 'nowrap' },
      keyName: 'customer_name',
      sortable: true,
    },
    {
      name: 'Criação',
      sortable: true,
      keyName: 'date',
      formatText: (row) => {
        return row?.date
          ? getDateWithTz(new Date(row.date)).toLocaleDateString('pt-BR')
          : '-'
      },
    },
    {
      name: 'Validade',
      keyName: 'validity',
      style: { whiteSpace: 'nowrap' },
      sortable: true,
      formatText: (row) => {
        return row?.validity ? new Date(row.validity).toLocaleString() : '-'
      },
    },
    {
      name: 'Status',
      keyName: 'status',
      formatText: (row) =>
        orderStatuses.find((o) => o.id === row?.status)?.name,
      style: {
        width: '120px',
        whiteSpace: 'nowrap',
      },
    },
  ]
  const onRowSelect = (row: TableRow<Order>): void => {
    setPayload({
      ...row,
      validity: row.validity ? new Date(row.validity) : undefined,
      date: row.date ? new Date(row.date) : undefined,
      product_discount:
        row.product_discount_type === DiscountType.PERCENT
          ? +(row.product_discount ?? 0)
          : row.product_discount,
      service_discount:
        row.service_discount_type === DiscountType.PERCENT
          ? +(row.service_discount ?? 0)
          : row.service_discount,
      employee_id: row.executing_by,
    })
  }

  const orderStatusOptions = useMemo(
    () => orderStatuses.map((o) => ({ value: o.id, label: o.name })),
    [orderStatuses]
  )
  const onCreateCustomerClick = (query: string) => {
    openSubScreen(
      {
        id: 'customer-register',
        contentSize: '700px 350px',
      },
      screen.id,
      {
        defaultCustomer: {
          name: query,
          personType: PersonType.PHYSICAL,
        },
        defaultScreenStatus: ScreenStatus.NEW,
      }
    )
  }
  const onCreateCustomer = (query: string) => {
    openSubScreen(
      {
        id: 'employees-register',
        contentSize: '700px 350px',
      },
      screen.id,
      {
        defaultCustomer: {
          name: query,
          personType: PersonType.PHYSICAL,
        },
        defaultScreenStatus: ScreenStatus.NEW,
      }
    )
  }
  return (
    <Container style={{ height: 'calc(100% - 87px)' }}>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body className='h-full'>
        <Bar className='my-1 flex flex-justify-end'>
          <ButtonGroup>
            <Button
              intent='primary'
              title='Mostrar resumo da ordem'
              rightIcon='th-list'
              onClick={openOrderResumeScreen}
              disabled={!payload.id}
            >
              Mostrar resumo
            </Button>
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
              onClick={openOrderProductScreen}
            >
              Produtos
            </Button>
          </ButtonGroup>
        </Bar>
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <Row className='flex-column'>
            <Box className='flex flex-wrap align-center'>
              <Render renderIf={Boolean(payload.id)}>
                <InputText<Order>
                  label='Número da ordem'
                  id={`${screen.id}-order-id`}
                  name='id'
                  disabled={isStatusVisualize}
                  readOnly
                />
              </Render>

              <InputText<Order>
                label='Referência'
                id={`${screen.id}-reference`}
                name='reference'
                readOnly={loadingReference}
                disabled={isStatusVisualize || loadingReference}
              />
              <InputDate<Order>
                label='Data'
                id={`${screen.id}-order-date`}
                timePrecision='minute'
                name='date'
                disabled={isStatusVisualize}
              />
              <InputDate<Order>
                intent={
                  payload?.validity
                    ? isBefore(payload.validity, new Date())
                      ? Intent.WARNING
                      : Intent.NONE
                    : Intent.NONE
                }
                timePrecision='minute'
                name='validity'
                label='Validade da nota'
                id={`${screen.id}-order-date`}
                disabled={isStatusVisualize}
              />
              <Select<Order>
                name='status'
                label='Status da ordem'
                fill
                buttonWidth={250}
                activeItem={payload?.status}
                items={orderStatusOptions}
                disabled={isStatusVisualize}
                loading={loadingOrderStatuses}
                handleButtonReloadClick={loadOrderStatuses}
              />
              <Select<Order>
                name='customer_id'
                fill
                buttonWidth={250}
                handleButtonReloadClick={loadCustomers}
                loading={loadingCustomers}
                required
                allowCreate
                defaultButtonText='Escolha um profissional'
                label='Cliente'
                items={customerOptions.options}
                handleCreateButtonClick={onCreateCustomerClick}
                buttonProps={
                  {
                    id: `${screen.id}-select-customer`,
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
              <Render renderIf={hasPermission(Permissions.READ_EMPLOYEE)}>
                <Select<Order>
                  fill
                  buttonWidth={250}
                  name='employee_id'
                  handleButtonReloadClick={loadEmployees}
                  loading={loadingEmployees}
                  required
                  allowCreate
                  defaultButtonText='Escolha um profissional'
                  label='Funcionário responsável'
                  items={employeeOptions}
                  handleCreateButtonClick={onCreateCustomer}
                  buttonProps={
                    {
                      id: `${screen.id}-select-customer`,
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
              </Render>
            </Box>
            <Box className='w-full'>
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
                        isStatusVisualize || !payload.product_discount_type
                      )}
                      label='Desconto nos produtos'
                      max={isProductDiscountTypePercent ? 100 : undefined}
                      leftIcon={
                        payload.product_discount_type
                          ? isProductDiscountTypePercent
                            ? 'percentage'
                            : 'dollar'
                          : undefined
                      }
                      value={
                        payload?.product_discount
                          ? String(payload?.product_discount)
                          : ''
                      }
                      onChange={(e: any) => {
                        let value = +e.target.value
                        if (isProductDiscountTypePercent && value > 100) {
                          value = 100
                        }

                        changePayloadAttribute('product_discount', value)
                      }}
                      selectProps={{
                        id: screen.id + 'select_product_discount_value',
                        disabled: isStatusVisualize,
                        activeItem: payload.product_discount_type,
                        onChange: (item) => {
                          const product_discountType =
                            item.value as DiscountType

                          setPayload((prev) => {
                            let product_discount = prev.product_discount

                            if (
                              isProductDiscountTypePercent &&
                              prev.product_discount! > 100
                            ) {
                              product_discount = 100
                            }

                            if (!product_discountType) {
                              product_discount = undefined
                            }
                            return {
                              ...prev,
                              product_discount_type: product_discountType,
                              product_discount,
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
                        isStatusVisualize || !payload.service_discount_type
                      )}
                      type='number'
                      max={isServiceDiscountTypePercent ? 100 : undefined}
                      leftIcon={
                        payload.service_discount_type
                          ? isServiceDiscountTypePercent
                            ? 'percentage'
                            : 'dollar'
                          : undefined
                      }
                      label='Desconto nos serviços'
                      value={
                        payload?.service_discount
                          ? String(payload?.service_discount)
                          : ''
                      }
                      onChange={(e: any) => {
                        let value = +e.target.value

                        if (isServiceDiscountTypePercent && value > 100) {
                          value = 100
                        }
                        changePayloadAttribute('service_discount', value)
                      }}
                      selectProps={{
                        disabled: isStatusVisualize,
                        intent: Intent.PRIMARY,
                        activeItem: payload.service_discount_type,
                        onChange: (item) => {
                          const serviceDiscountTYpe = item.value as DiscountType

                          setPayload((prev) => {
                            let service_discount = prev.service_discount

                            if (
                              isServiceDiscountTypePercent &&
                              prev.service_discount! > 100
                            ) {
                              service_discount = 100
                            }

                            if (!serviceDiscountTYpe) {
                              service_discount = undefined
                            }
                            return {
                              ...prev,
                              service_discount_type: serviceDiscountTYpe,
                              service_discount,
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
                        changePayloadAttribute(
                          'description',
                          e.currentTarget.value
                        )
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
            </Box>
            <Box className='w-full'>
              <Collapse title='Configurações'>
                <Row>
                  <Switch<OrderPayload>
                    name='sendNotificationWhenConcluded'
                    label='Enviar comprovanete ao cliente'
                  />
                </Row>
              </Collapse>
            </Box>
          </Row>
        </Render>
        <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
          <Row style={{ flex: 1 }} className='h-full' column>
            <Box style={{ flex: 1 }}>
              <Row className='h-full'>
                <PaginatedTable<Order>
                  containerProps={{
                    className: 'styled-scroll',
                    style: {
                      width: '100%',
                    },
                  }}
                  rowKey={(row) => row.id + (row?.created_at ?? '')}
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

export default ServiceOrder
