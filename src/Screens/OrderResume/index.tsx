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
import {
  DiscountType,
  DiscountTypeSymbol,
  OrderStatusByValue,
} from '../../Constants/Enums'
import { Column, Row as TableRow } from '../../Contracts/Components/Table'
import User from '../../Contracts/Models/User'
import OrderResumeScreenProps from '../../Contracts/Screen/OrderResume'
import { useAlert } from '../../Hooks/useAlert'
import useAsync from '../../Hooks/useAsync'
import { useToast } from '../../Hooks/useToast'
import OrderService, {
  OrderPartResponse,
  OrderServicePaginatedResponse,
} from '../../Services/OrderService'

const OrderResume: FunctionComponent<OrderResumeScreenProps> = (props) => {
  const { openAlert } = useAlert()

  useEffect(() => {
    if (!props.order.id) {
      openAlert({
        intent: Intent.WARNING,
        text: 'Você precisa selecionar uma ordem de serviço para acessar essa tela',
      })
      props.screen.close()
    }
  },[])
  const [order, setOrder] = useState(() => ({
    ...props.order,
    product_discount: (props?.order.product_discount ?? 0) ,
    service_discount: (props?.order.service_discount ?? 0),
  }))
  const [loadingOrder, loadOrder] = useAsync(async () => {
    try {
      const response = await OrderService.getOne(order.id!)
      setOrder({
        ...response.data.data,
        product_discount: (response.data.data?.product_discount ?? 0) * 100,
        service_discount: (response.data.data?.service_discount ?? 0) * 100,
      })
    } catch (error) {
      showErrorToast({
        message: 'Não foi possível recarregar a ordem de serviço',
      })
    }
  }, [props.order])
  const { showErrorToast } = useToast()
  const [costumer, setCostumer] = useState<User | null>(null)
  const [isCostumerCollapsed, setIsCostumerCollapsed] = useState(false)
  const [loadingCostumers, loadCostumer] = useAsync(async () => {
    if (!order?.id) return

    const response = await OrderService.getOrderCostumer(order.id)

    setCostumer(response.data.data)
  }, [])
  const [isOrderServicesCollapsed, setIsOrderServicesCollapsed] =
    useState(false)
  const [isOrderPartsCollapsed, setIsOrderPartsCollapsed] = useState(false)
  const [orderServices, setOrderServices] = useState<
    OrderServicePaginatedResponse[]
  >([])
  const [orderParts, setOrderParts] = useState<OrderPartResponse[]>([])
  const [loadingOrderServices, loadOrderServices] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderServicesResponse = await OrderService.getOrderServices(order.id!)
    setOrderServices(orderServicesResponse.data.data)
  }, [])

  const [loadingOrderParts, loadOrderParts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderPartsResponse = await OrderService.getOrderParts(order.id!)

    setOrderParts(orderPartsResponse.data.data)
  }, [])
  const orderServiceTableRows = orderServices.map((orderService) => ({
    ...orderService.order_service,
    ...orderService.service,
  }))

  const orderPartTableRows = orderParts.map(
    (orderPart) =>
      ({
        ...orderPart.order_part,
        ...orderPart.part,
      } as Record<string, any>)
  )

  const formatValue = (value: any, type?: DiscountType) => {
    const prefix = DiscountTypeSymbol[type!]

    return prefix + (value?.toFixed(2) ?? 0)
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
              {'R$ ' +
                calcValueWithDiscount(
                  totalValue,
                  order?.service_discount,
                  order?.service_discount_type
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
                {'R$ ' +
                  calcValueWithDiscount(
                    totalValue,
                    order?.product_discount,
                    order?.product_discount_type
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
    loadOrderParts()
    loadCostumer()
    loadOrder()
  }

  const generateOrderResumeReport = () => {
    OrderService.downloadOrderResumeReport(order)
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
            loading={loadingOrderParts && loadingOrderServices}
          >
            Recarregar dados da tela
          </Button>
        </Bar>
      </Row>

      <Row className='w-100 mb-3'>
        <Box className='w-100'>
          <Collapse
            title={
              <Row>
                Dados do cliente
                <Render renderIf={loadingCostumers}>
                  <Spinner size={10} />
                </Render>
              </Row>
            }
            isCollapsed={isCostumerCollapsed || loadingCostumers}
            onChange={() => setIsCostumerCollapsed((prev) => !prev)}
          >
            <Render renderIf={!loadingCostumers}>
              <Row className='flex align-center w-100'>
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
                  value={costumer?.name}
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
                  value={costumer?.email}
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
      <Row className='w-100 mb-3'>
        <Box className='w-100'>
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
                value={
                  DiscountTypeSymbol[order.service_discount_type!] +
                  ' ' +
                  order.product_discount?.toFixed(2)
                }
                id=''
              />
              <InputText
                label='Desconto em serviços'
                readOnly
                value={
                  DiscountTypeSymbol[order.product_discount_type!] +
                  ' ' +
                  order.service_discount?.toFixed(2)
                }
                id=''
              />
              <InputText
                label='Status'
                readOnly
                value={OrderStatusByValue[+order.status!]}
                id=''
              />
            </Row>
          </Collapse>
        </Box>
      </Row>
      <Row className='w-100 mb-3'>
        <Box className='w-100'>
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
                    return (
                      'R$ ' +
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

      <Row className='w-100'>
        <Box className='w-100'>
          <Collapse
            title={
              <Row>
                Produtos
                <Render renderIf={loadingCostumers}>
                  <Spinner size={10} />
                </Render>
              </Row>
            }
            isCollapsed={isOrderPartsCollapsed || loadingCostumers}
            onChange={() => setIsOrderPartsCollapsed((prev) => !prev)}
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
                    return (
                      'R$ ' +
                      +(row?.replaced_price ?? row?.price ?? 0) *
                        +(row?.quantity ?? 0)
                    )
                  },
                },
              ]}
              rows={orderPartTableRows}
              renderFooter={renderProductFooter}
            />
          </Collapse>
        </Box>
      </Row>
    </Container>
  )
}

export default OrderResume