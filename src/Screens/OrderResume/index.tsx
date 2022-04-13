import { Spinner } from '@blueprintjs/core'
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
import { DiscountType } from '../../Constants/Enums'
import { Column, Row as TableRow } from '../../Contracts/Components/Table'
import User from '../../Contracts/Models/User'
import OrderResumeScreenProps from '../../Contracts/Screen/OrderResume'
import useAsync from '../../Hooks/useAsync'
import OrderService, {
  OrderPartResponse,
  OrderServicePaginatedResponse,
} from '../../Services/OrderService'

const OrderResume: FunctionComponent<OrderResumeScreenProps> = (props) => {
  useEffect(() => {
    props.screen.setTheme('danger')
  }, [])

  const [costumer, setCostumer] = useState<User | null>(null)
  const [isCostumerCollapsed, setIsCostumerCollapsed] = useState(false)
  const [loadingCostumers, loadCostumer] = useAsync(async () => {
    if (!props.order?.id) return

    const response = await OrderService.getOrderCostumer(props.order.id)

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
    const orderServicesResponse = await OrderService.getOrderServices(
      props.order.id
    )
    setOrderServices(orderServicesResponse.data.data)
  }, [])

  const [loadingOrderParts, loadOrderParts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderPartsResponse = await OrderService.getOrderParts(props.order.id)

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

  const formatValue = (value: any, type: any) => {
    let prefix = 'R$ '
    if (type === DiscountType.PERCENT) {
      prefix = '% '
    }

    return prefix + value.toFixed(2)
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
        <Render renderIf={Boolean(props.order?.service_discount_type)}>
          <tr>
            <td
              colSpan={3}
              style={{
                boxShadow: 'inset 0 1px 1px rgb(17 20 24 / 15%)',
              }}
            >
              <strong>Tipo de desconto: </strong>{' '}
              {props.order?.service_discount_type}
            </td>
            <td
              style={{
                boxShadow: 'inset 1px 1px 1px rgb(17 20 24 / 15%)',
              }}
            >
              <strong>
                {formatValue(
                  props.order?.service_discount,
                  props.order?.service_discount_type
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
              R$ $
              {calcValueWithDiscount(
                totalValue,
                props.order?.service_discount,
                props.order?.service_discount_type
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
          <Render renderIf={Boolean(props.order?.product_discount_type)}>
            <tr>
              <td
                colSpan={3}
                style={{
                  boxShadow: 'inset 0 1px 1px rgb(17 20 24 / 15%)',
                }}
              >
                <strong>Tipo de desconto: </strong>{' '}
                {props.order?.product_discount_type}
              </td>
              <td
                style={{
                  boxShadow: 'inset 1px 1px 1px rgb(17 20 24 / 15%)',
                }}
              >
                <strong>
                  {formatValue(
                    props.order?.product_discount,
                    props.order?.product_discount_type
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
                R$ $
                {calcValueWithDiscount(
                  totalValue,
                  props.order?.product_discount,
                  props.order?.product_discount_type
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
  }

  return (
    <Container
      style={{
        paddingBottom: 5,
      }}
    >
      <Row>
        <Bar>
          <Button icon='download'>Gerar documento</Button>
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
                  label='Nome do cliente'
                  readOnly
                  value={costumer?.name}
                />
                <InputText
                  style={{
                    flex: 1,
                  }}
                  inputStyle={{
                    width: '100%',
                  }}
                  id=''
                  label='Email'
                  readOnly
                  value={costumer?.email}
                />
              </Row>
            </Render>
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
