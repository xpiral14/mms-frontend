import { Intent, Spinner } from '@blueprintjs/core'
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Button from '../../Components/Button'
import Collapse from '../../Components/Collapse'
import InputText from '../../Components/InputText'
import Bar from '../../Components/Layout/Bar'
import Box from '../../Components/Layout/Box'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import Render from '../../Components/Render'
import Table from '../../Components/Table'
import { DiscountType, DiscountTypeSymbol } from '../../Constants/Enums'
import { Column, Row as TableRow } from '../../Contracts/Components/Table'
import User from '../../Contracts/Models/User'
import OrderResumeScreenProps from '../../Contracts/Screen/OrderResume'
import { useAlert } from '../../Hooks/useAlert'
import useAsync from '../../Hooks/useAsync'
import { useToast } from '../../Hooks/useToast'
import OrderService, {
  OrderProductResponse,
  OrderServicePaginatedResponse,
  ProfitResumeResponse,
} from '../../Services/OrderService'
import OrderStatus from '../../Contracts/Models/OrderStatus'
import currencyFormat from '../../Util/currencyFormat'
import Order from '../../Contracts/Models/Order'
import useMessageError from '../../Hooks/useMessageError'

const OrderResume: FunctionComponent<OrderResumeScreenProps> = (props) => {
  const { openAlert } = useAlert()
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([])

  const [profitResume, setProfitResume] = useState<ProfitResumeResponse>({
    total_profit: 0,
    total_sale: 0,
    total_profit_percent: 0,
    order_products: {},
  })
  useEffect(() => {
    if (!props.order.id) {
      openAlert({
        intent: Intent.WARNING,
        text: 'Você precisa selecionar uma ordem de serviço para acessar essa tela',
      })
      props.screen.close()
    }
  }, [])
  const [order, setOrder] = useState<Partial<Order>>(() => ({
    ...props.order,
    product_discount: props.order?.product_discount ?? 0,
    service_discount: props.order?.service_discount ?? 0,
  }))
  const [loadingOrder, loadOrder] = useAsync(async () => {
    try {
      const response = await OrderService.getOne(order.id!)
      const orderResponse = response.data.data
      setOrder({
        ...orderResponse,
        product_discount: +(orderResponse?.product_discount ?? '0'),
        service_discount: +(orderResponse?.service_discount ?? '0'),
      })
    } catch (error) {
      showErrorToast({
        message: 'Não foi possível recarregar a ordem de serviço',
      })
    }
  }, [props.order])

  const [loadingOrderStatuses, loadOrderStatuses] = useAsync(async () => {
    try {
      const response = await OrderService.getOrderStatuses()
      setOrderStatuses(response.data.data)
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter lista de clientes',
      })
    }
  }, [])

  const { showErrorToast } = useToast()
  const [customer, setCustomer] = useState<User | null>(null)
  const [isCustomerCollapsed, setIsCustomerCollapsed] = useState(false)
  const [loadingCustomers, loadCustomer] = useAsync(async () => {
    if (!order?.id) return

    const response = await OrderService.getOrderCustomer(order.id)

    setCustomer(response.data.data)
  }, [])
  const [isOrderServicesCollapsed, setIsOrderServicesCollapsed] =
    useState(false)
  const [isOrderProductsCollapsed, setIsOrderProductsCollapsed] =
    useState(false)
  const [orderServices, setOrderServices] = useState<
    OrderServicePaginatedResponse[]
  >([])

  const { showErrorMessage } = useMessageError()
  const [orderProducts, setOrderProducts] = useState<OrderProductResponse[]>([])
  const [loadingOrderServices, loadOrderServices] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderServicesResponse = await OrderService.getOrderServices(order.id!)
    setOrderServices(orderServicesResponse.data.data)
  }, [])

  const [loadingOrderProducts, loadOrderProducts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderProductsResponse = await OrderService.getOrderProducts(order.id!)
    setOrderProducts(orderProductsResponse.data.data)
  }, [])

  const [, loadResumeProfit] = useAsync(async () => {
    if (!props.order?.id) return

    try {
      const orderResumeProfit = await OrderService.getOrderProfitResume(
        props.order.id
      )
      setProfitResume(orderResumeProfit.data.data)
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível obter os dados de lucro da venda. Tente novamente mais tarde'
      )
    }
  }, [])

  const orderServiceTableRows = orderServices.map((orderService) => ({
    ...orderService.order_service,
    ...orderService.service,
  })) as any[]

  const orderProductTableRows = orderProducts.map(
    (orderProduct) =>
      ({
        ...orderProduct.order_product,
        ...orderProduct.product,
      } as Record<string, any>)
  )

  const formatValue = (value?: number, type?: DiscountType) => {
    if (!type) {
      return 'Sem desconto'
    }
    const prefix = DiscountTypeSymbol[type!]
    let formattedValue = value?.toFixed(2)
    if (type === DiscountType.VALUE) {
      formattedValue = currencyFormat(value)
    }
    return `${prefix}  ${formattedValue}`
  }

  const calcValueWithDiscount = (value: any, discount: any, type: any) => {
    let finalValue = value
    switch (type) {
    case DiscountType.PERCENT:
      finalValue = value - value * (discount / 100)
      break
    case DiscountType.VALUE:
      finalValue = value - discount
      break
    }

    if (finalValue < 0) {
      finalValue = 0
    }

    return finalValue.toFixed(2)
  }

  const renderFooter = useCallback((columns: Column[], rows: TableRow[]) => {
    const totalValue = rows.reduce((acc, row) => {
      const price = +(row?.replaced_price ?? row?.price ?? 0)

      return price * +(row?.quantity ?? 0) + acc
    }, 0)

    return (
      <>
        <Render renderIf={Boolean(order?.service_discount_type)}>
          <tr>
            <td
              colSpan={3}
              style={{
                boxShadow: 'inset 0 1px 1px rgb(17 20 24 / 15%)',
              }}
            >
              <strong>Tipo de desconto: </strong> {order?.service_discount_type}
            </td>
            <td
              style={{
                boxShadow: 'inset 1px 1px 1px rgb(17 20 24 / 15%)',
              }}
            >
              <strong>
                {formatValue(
                  order?.service_discount,
                  order?.service_discount_type
                )}
              </strong>
            </td>
          </tr>
        </Render>
        <tr style={{}}>
          <td
            colSpan={3}
            style={{
              boxShadow: 'inset 0 1px 1px rgb(17 20 24 / 15%)',
            }}
          >
            <strong>Valor total</strong>
          </td>
          <td
            style={{
              boxShadow: 'inset 1px 1px 1px rgb(17 20 24 / 15%)',
            }}
          >
            <strong>
              {currencyFormat(
                calcValueWithDiscount(
                  totalValue,
                  order?.service_discount,
                  order?.service_discount_type
                )
              )}
            </strong>
          </td>
        </tr>
      </>
    )
  }, [])

  const renderProductFooter = useCallback(
    (columns: Column[], rows: TableRow[]) => {
      const totalValue = rows.reduce((acc, row) => {
        const price = +(row?.replaced_price ?? row?.price ?? 0)

        return price * +(row?.quantity ?? 0) + acc
      }, 0)

      return (
        <>
          <Render renderIf={Boolean(order?.product_discount_type)}>
            <tr>
              <td
                colSpan={3}
                style={{
                  boxShadow: 'inset 0 1px 1px rgb(17 20 24 / 15%)',
                }}
              >
                <strong>Tipo de desconto: </strong>{' '}
                {order?.product_discount_type}
              </td>
              <td
                style={{
                  boxShadow: 'inset 1px 1px 1px rgb(17 20 24 / 15%)',
                }}
              >
                <strong>
                  {formatValue(
                    order?.product_discount,
                    order?.product_discount_type
                  )}
                </strong>
              </td>
            </tr>
          </Render>
          <tr>
            <td
              colSpan={3}
              style={{
                boxShadow: 'inset 0 1px 1px rgb(17 20 24 / 15%)',
              }}
            >
              <strong>Valor total</strong>
            </td>
            <td
              style={{
                boxShadow: 'inset 1px 1px 1px rgb(17 20 24 / 15%)',
              }}
            >
              <strong>
                {currencyFormat(
                  calcValueWithDiscount(
                    totalValue,
                    order?.product_discount,
                    order?.product_discount_type
                  )
                )}
              </strong>
            </td>
          </tr>
        </>
      )
    },
    []
  )

  const reloadAll = () => {
    loadOrderServices()
    loadOrderProducts()
    loadCustomer()
    loadOrder()
    loadOrderStatuses()
    loadResumeProfit()
  }

  const generateOrderResumeReport = async () => {
    try {
      await OrderService.downloadOrderResumeReport(order)
    } catch (error) {
      showErrorToast(
        'Não foi possível emitir o relatório de resumo da ordem de serviço. Por favor, tente novamente!'
      )
    }
  }
  return (
    <Container
      style={{
        paddingBottom: 5,
      }}
    >
      <Row>
        <Bar>
          <Button onClick={generateOrderResumeReport} icon='download'>
            Gerar documento
          </Button>
          <Button
            icon='refresh'
            onClick={reloadAll}
            loading={
              loadingOrderProducts &&
              loadingOrderServices &&
              loadingOrderStatuses
            }
          >
            Recarregar dados da tela
          </Button>
        </Bar>
      </Row>

      <Row className='mb-3 w-full'>
        <Box className='w-full'>
          <Collapse
            title={
              <Row>
                Dados do cliente
                <Render renderIf={loadingCustomers}>
                  <Spinner size={10} />
                </Render>
              </Row>
            }
            isCollapsed={isCustomerCollapsed || loadingCustomers}
            onChange={() => setIsCustomerCollapsed((prev) => !prev)}
          >
            <Render renderIf={!loadingCustomers}>
              <Row className='flex w-full align-center'>
                <InputText
                  id=''
                  style={{
                    flex: 0.4,
                  }}
                  inputStyle={{
                    width: '100%',
                  }}
                  label='Nome do cliente'
                  readOnly
                  value={customer?.name}
                />
                <InputText
                  style={{
                    flex: 0.4,
                  }}
                  inputStyle={{
                    width: '100%',
                  }}
                  id=''
                  label='Email'
                  readOnly
                  value={customer?.email}
                />
                <InputText
                  style={{
                    flex: 0.2,
                  }}
                  inputStyle={{
                    width: '100%',
                  }}
                  id=''
                  label='Telefone'
                  readOnly
                  value={'(61) 98159-8138'}
                />
              </Row>
            </Render>
          </Collapse>
        </Box>
      </Row>
      <Row className='mb-3 w-full'>
        <Box className='w-full'>
          <Collapse
            isCollapsed={loadingOrder}
            title={
              <Row>
                Ordem
                <Render renderIf={loadingOrder}>
                  <Spinner size={10} />
                </Render>
              </Row>
            }
          >
            <Row>
              <InputText label='Código' readOnly value={order.id} id='' />
              <InputText
                label='Referência'
                readOnly
                value={order?.reference}
                id=''
              />
              <InputText
                label='Desconto em produtos'
                readOnly
                value={formatValue(
                  order.product_discount ?? 0,
                  order.product_discount_type
                )}
                id=''
              />
              <InputText
                label='Desconto em serviços'
                readOnly
                value={formatValue(
                  order.service_discount,
                  order.service_discount_type
                )}
                id=''
              />
              <InputText
                label='Status'
                readOnly
                value={orderStatuses.find((o) => o.id === order.status)?.name}
                id=''
              />
              <InputText
                label='Lucro total'
                readOnly
                value={currencyFormat(profitResume.total_profit)}
                id=''
              />
              <InputText
                label='Total de vendas'
                readOnly
                value={currencyFormat(profitResume.total_sale)}
                id=''
              />
              <InputText
                label='Porcentagem de lucro'
                readOnly
                value={`${profitResume.total_profit_percent}%`}
                id=''
              />
            </Row>
          </Collapse>
        </Box>
      </Row>
      <Row className='mb-3 w-full'>
        <Box className='w-full'>
          <Collapse
            title={
              <Row>
                Serviços
                <Render renderIf={loadingOrderServices}>
                  <Spinner size={10} />
                </Render>
              </Row>
            }
            isCollapsed={isOrderServicesCollapsed || loadingOrderServices}
            onChange={() => setIsOrderServicesCollapsed((prev) => !prev)}
          >
            <Table
              columns={[
                {
                  name: 'Nome do serviço',
                  keyName: 'name',
                },
                {
                  name: 'Quantidade',
                  keyName: 'quantity',
                },
                {
                  name: 'Valor unitário',
                  formatText: (row) => row?.replaced_price ?? row?.price ?? 0,
                },
                {
                  name: 'Valor total',
                  formatText: (row) => {
                    return currencyFormat(
                      +(row?.replaced_price ?? row?.price ?? 0) *
                        +(row?.quantity ?? 1)
                    )
                  },
                },
              ]}
              rows={orderServiceTableRows}
              renderFooter={renderFooter}
            />
          </Collapse>
        </Box>
      </Row>

      <Row className='w-full'>
        <Box className='w-full'>
          <Collapse
            title={
              <Row>
                Produtos
                <Render renderIf={loadingCustomers}>
                  <Spinner size={10} />
                </Render>
              </Row>
            }
            isCollapsed={isOrderProductsCollapsed || loadingCustomers}
            onChange={() => setIsOrderProductsCollapsed((prev) => !prev)}
          >
            <Table
              columns={[
                {
                  name: 'Nome do produto',
                  keyName: 'name',
                },
                {
                  name: 'Quantidade',
                  keyName: 'quantity',
                },
                {
                  name: 'Valor unitário',
                  formatText: (row) => row?.replaced_price ?? row?.price ?? 0,
                },
                {
                  name: 'Valor total',
                  formatText: (row) => {
                    return currencyFormat(
                      +(row?.replaced_price ?? row?.price ?? 0) *
                        +(row?.quantity ?? 0)
                    )
                  },
                },
              ]}
              rows={orderProductTableRows}
              renderFooter={renderProductFooter}
            />
          </Collapse>
        </Box>
      </Row>
    </Container>
  )
}

export default OrderResume
