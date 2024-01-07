import React, { FunctionComponent, useCallback, useMemo, useState } from 'react'
import {
  OrderProductDetailsScreenProps,
  OrderProductItem,
} from '../../Contracts/Screen/OrderProductDetails'
import useAsync from '../../Hooks/useAsync'
import Render from '../../Components/Render'
import OrderService from '../../Services/OrderService'
import OrderProductModel from '../../Contracts/Models/OrderProduct'
import Container from '../../Components/Layout/Container'
import {
  Button,
  ButtonGroup,
  Intent,
  ProgressBar,
  TextArea,
} from '@blueprintjs/core'
import { useToast } from '../../Hooks/useToast'
import Box from '../../Components/Layout/Box'
import Row from '../../Components/Layout/Row'
import Collapse from '../../Components/Collapse'
import InputText from '../../Components/InputText'
import Bar from '../../Components/Layout/Bar'
import NumericInput from '../../Components/NumericInput'
import { useAlert } from '../../Hooks/useAlert'
import Empty from '../../Components/Empty'
import ProductStock from '../../Contracts/Models/ProductStock'
import useMessageError from '../../Hooks/useMessageError'
import ProductStockService from '../../Services/ProductStockService'
import { uniqueId } from '@blueprintjs/core/lib/esm/common/utils'
import OrderProduct from '../../Contracts/Models/OrderProduct'
import AsyncTableSelect from '../../Components/AsyncTableSelect'
import {
  Column,
  Filters,
  Row as TableRowContract,
} from '../../Contracts/Components/Table'
import InputNumber from '../../Components/InputNumber'
import strToNumber from '../../Util/strToNumber'
import currencyFormat from '../../Util/currencyFormat'

const OrderProductDetails: FunctionComponent<OrderProductDetailsScreenProps> = (
  props
) => {
  const { showErrorToast } = useToast()
  const { showErrorMessage } = useMessageError()
  const { openAlert } = useAlert()
  const [orderProducts, setOrderProducts] = useState<OrderProductItem[]>(() =>
    (props.selectedOrderProducts || []).map((orderProduct) => {
      return {
        description: orderProduct.description,
        id: orderProduct.id,
        unique_key: uniqueId('orderProducts'),
        isCollapsed: true,
        isEditMode: false,
        order_id: orderProduct.order_id,
        quantity: orderProduct.quantity,
        replaced_price: orderProduct.replaced_price,
        product_id: orderProduct.product_id,
        product_stock_id: orderProduct.product_stock_id,
        product_name: orderProduct?.product_name,
        product_price: orderProduct?.product_price,
        product_unit_id: orderProduct?.product_unit_id,
        product_unit_name: orderProduct?.product_unit_name,
      }
    })
  )

  const searchForProductsFromAllStocks = useCallback(
    (page: number, limit: number, filters?: Filters) => {
      return ProductStockService.getAllFromAllStocks(page, limit, filters)
    },
    []
  )

  const [loadingOrderProducts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderProductsResponse = await OrderService.getOrderProducts(
      props.order.id
    )
    const orderProductItems = orderProductsResponse.data.data.map(
      (orderProduct) => {
        return {
          unique_key: uniqueId('orderProducts'),
          description: orderProduct.order_product.description,
          id: orderProduct.order_product.id,
          isCollapsed: true,
          isEditMode: false,
          order_id: orderProduct.order_product.order_id,
          quantity: orderProduct.order_product.quantity,
          replaced_price: orderProduct.order_product.replaced_price,
          product_stock_id: orderProduct.order_product.product_stock_id,
          product_id: orderProduct.product.id,
          product_name: orderProduct.product?.name,
          product_price: orderProduct.product?.price,
          product_unit_id: orderProduct.product.unit_id,
          product_unit_name: orderProduct?.product?.unit_name,
        } as OrderProductItem
      }
    )

    setOrderProducts(orderProductItems)
  }, [])

  const changeOrderProductItem = (
    index: number,
    attributes: OrderProductItem
  ) => {
    setOrderProducts((prev) => {
      const copy = [...prev]
      copy[index as number] = {
        ...prev[index as number],
        ...attributes,
      }

      return copy
    })
  }

  const removeOrderProduct = (productStock: OrderProductItem) => {
    setOrderProducts((prev) => {
      const copy = [...prev]

      return copy.filter((p) => p.unique_key !== productStock.unique_key)
    })
  }

  function restoreOrderProductAtState(orderProduct: OrderProductItem) {
    setOrderProducts((prev) => [...prev, orderProduct])
  }

  const handleDeleteOrderProduct = (orderProduct: OrderProductItem) => {
    const onError = () => {
      showErrorToast({
        message:
          'Não foi possível excluir o produto ' +
          orderProduct.product_name +
          ' da ordem de serviço. Por favor, tente novamente',
      })
      restoreOrderProductAtState(orderProduct)
    }
    if (props?.order?.id && orderProduct?.id) {
      OrderService.deleteOrderProduct(props!.order.id, orderProduct.id).catch(
        onError
      )
    }
    removeOrderProduct(orderProduct)
  }

  const handleDeleteButtonClick =
    (orderProduct: OrderProductItem) => (event: any) => {
      event.stopPropagation()
      openAlert({
        text: 'Tem certeza que deseja remover o produto?',
        icon: 'trash',
        onConfirm: () => handleDeleteOrderProduct(orderProduct),
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar remoção do produto',
        intent: Intent.DANGER,
      })
    }

  function toOrderProductModel(orderProductItem: OrderProductItem) {
    return {
      id: orderProductItem?.id,
      order_id: props?.order?.id,
      replaced_price: orderProductItem.replaced_price,
      product_stock_id: orderProductItem.product_stock_id,
      quantity: orderProductItem.quantity,
      description: orderProductItem.description,
      product_id: orderProductItem.product_id,
      product_name: orderProductItem.product_name,
      product_unit_name: orderProductItem.product_unit_name,
      product_unit_id: orderProductItem.product_unit_id,
      product_price: orderProductItem.product_price,
    } as Partial<OrderProductModel>
  }

  const alertThatHasUnsavedOrderProductItems = (onConfirm: () => void) => {
    openAlert({
      text: 'Tem certeza que deseja salvar todos?',
      intent: 'warning',
      icon: 'warning-sign',
      onConfirm,
    })
  }

  const hasUnsavedOrderProductItems = useMemo(
    () => orderProducts.some((s) => s.isEditMode),
    [orderProducts]
  )

  const handleButtonSave = () => {
    const savedOrderProducts = Object.values(orderProducts).filter(
      (s) => !s.isEditMode
    )

    const onConfirm = async () => {
      const unSavedOrderServices = Object.values(orderProducts).filter(
        (s) => s.isEditMode
      )
      try {
        if (!props.order?.id) {
          props.onSave?.(
            orderProducts.map(toOrderProductModel) as OrderProduct[],
            props.screen
          )
          return
        }
        await Promise.all(
          unSavedOrderServices.map(async (osi) => {
            const osModel = toOrderProductModel(osi)
            if (osi.id) {
              await OrderService.editProduct(props.order!.id!, osModel)
              return
            }
            osi = (await OrderService.addProduct(props.order!.id!, osModel))
              .data.data

            savedOrderProducts.push({
              ...osi,
              isEditMode: false,
            })
          })
        )

        const items: Record<string, OrderProductItem> = {}

        savedOrderProducts.forEach((os) => {
          items[os.unique_key!] = os
        })

        const newOrderProductItems = orderProducts.map((orderProduct) => {
          return items[orderProduct.unique_key!] ?? orderProduct
        })

        setOrderProducts(newOrderProductItems)

        props.onSave?.(
          newOrderProductItems.map(toOrderProductModel) as OrderProduct[],
          props.screen
        )
      } catch (error: any) {
        showErrorToast({
          message:
            'Não foi possível salvar todas os serviços da ordem ainda não salvos. Por favor, tente novamente!',
        })
      }
    }

    if (hasUnsavedOrderProductItems) {
      alertThatHasUnsavedOrderProductItems(onConfirm)
      return
    }

    onConfirm()
  }

  const handleButtonExit = () => {
    const onConfirm = () => props.screen.close()
    if (hasUnsavedOrderProductItems) {
      alertThatHasUnsavedOrderProductItems(onConfirm)
      return
    }
    onConfirm()
  }

  const handleProductSelect = (productStock: ProductStock) => {
    const orderProduct: OrderProductItem = {
      id: undefined,
      order_id: props?.order?.id ?? undefined,
      product_id: productStock.product_id as number,
      description: undefined,
      quantity: 1,
      product_stock_id: productStock.id,
      replaced_price: undefined,
      product_name: productStock.product?.name,
      product_price: productStock.product?.price,
      product_unit_name: productStock?.product?.unit?.name,
      product_unit_id: productStock.product?.unit_id,
      isEditMode: true,
      isCollapsed: false,
      unique_key: uniqueId('orderProducts'),
    }
    setOrderProducts((prev) => [...prev, orderProduct])
  }

  const handleOrderProductSave = (orderProductKey: number) => (event: any) => {
    event.stopPropagation()
    const orderProductItem = orderProducts[orderProductKey]

    const orderId = props.order?.id

    const onErrorRequest = (error: any) => {
      showErrorMessage(error, 'Não foi possível salvar a produto')
      changeOrderProductItem(orderProductKey, {
        isEditMode: true,
      })
    }
    const orderProduct = toOrderProductModel(orderProductItem)
    if (orderId && !orderProductItem.id) {
      OrderService.addProduct(orderId, {
        ...orderProductItem,
        replaced_price: strToNumber(orderProductItem.replaced_price),
      })
        .then((response) => {
          changeOrderProductItem(orderProductKey, {
            id: response.data.data.id,
          })
        })
        .catch(onErrorRequest)
    }

    if (orderId && orderProductItem.id) {
      OrderService.editProduct(orderId, orderProduct).catch(onErrorRequest)
    }

    setOrderProducts((prev) => {
      const copy = [...prev]
      copy[orderProductKey] = {
        ...copy[orderProductKey],
        isEditMode: false,
      }
      return copy
    })
  }

  const handleOrderProductEdit = (orderProductKey: number) => (event: any) => {
    event.stopPropagation()
    changeOrderProductItem(orderProductKey, {
      isCollapsed: false,
      isEditMode: true,
    })
  }
  const handleQuantityChange = (productStockId: number) => (value?: string) => {
    changeOrderProductItem(+productStockId, {
      replaced_price: value as any,
    })
  }

  const handleDescriptionChange = (productStockId: number) => (event: any) => {
    changeOrderProductItem(+productStockId, {
      description: event.target.value,
    })
  }

  const columns = useMemo(
    () =>
      [
        {
          formatText: (r) => r?.product?.reference,
          name: 'Referência',
          filters: [
            {
              name: 'Nome do produto',
              keyName: 'reference' as any,
              type: 'text',
            },
          ],
        },
        {
          formatText: (r) => r?.product?.name,
          name: 'Produto',
          filters: [
            {
              name: 'Nome do produto',
              keyName: 'product_name' as any,
              type: 'text',
            },
          ],
        },
        {
          formatText: (r) => r?.stock.name,
          name: 'Estoque',
          filters: [
            {
              name: 'Nome do produto',
              keyName: 'stock_name' as any,
              type: 'text',
            },
          ],
        },
        {
          formatText: (r) => r?.quantity,
          name: 'Quantidade no estoque',
        },
      ] as Column<ProductStock>[],
    []
  )
  const isSelected = useCallback(
    (r: TableRowContract<ProductStock>): boolean => {
      return orderProducts.some((o) => o.product_stock_id === r.id)
    },
    [orderProducts]
  )
  return (
    <Container>
      <Row className='mb-2 w-full'>
        <Bar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            intent={Intent.SUCCESS}
            icon='floppy-disk'
            onClick={handleButtonSave}
          >
            Salvar todos
          </Button>

          <Button
            icon='log-out'
            intent={Intent.NONE}
            onClick={handleButtonExit}
          >
            Sair
          </Button>
        </Bar>
      </Row>
      <Row className='mb-2'>
        <AsyncTableSelect<ProductStock>
          buttonProps={{
            fill: true,
            alignText: 'left',
            rightIcon: 'circle-arrow-down',
            text: 'Selecione os produtos',
          }}
          popoverProps={{ fill: true, className: 'w-full' }}
          columns={columns}
          onRowSelect={handleProductSelect}
          isSelected={isSelected}
          request={searchForProductsFromAllStocks}
        />
      </Row>
      <Render renderIf={loadingOrderProducts}>
        <ProgressBar intent={Intent.SUCCESS} />
      </Render>
      <Render renderIf={!orderProducts.length && !loadingOrderProducts}>
        <Empty />
      </Render>
      {orderProducts.map((orderProduct, orderProductKey) => {
        const price = strToNumber(
          orderProduct.replaced_price ?? orderProduct.product_price ?? 0
        )
        const onCollapseChange = () =>
          setOrderProducts((prev) => {
            const copy = [...prev]
            copy[orderProductKey] = {
              ...copy[orderProductKey],
              isCollapsed: !copy[orderProductKey].isCollapsed,
            }
            return copy
          })
        const onQuantityValueChange = (value: any) => {
          changeOrderProductItem(orderProductKey, {
            quantity: value,
          })
        }
        return (
          <Box key={orderProductKey} style={{ marginBottom: 10 }}>
            <Collapse
              bordered
              isCollapsed={orderProduct.isCollapsed}
              onChange={onCollapseChange}
              title={
                <Row className='w-full flex-between'>
                  <span>{orderProduct.product_name}</span>
                  <ButtonGroup>
                    <Render renderIf={!orderProduct.isEditMode}>
                      <Button
                        icon='edit'
                        intent={Intent.NONE}
                        onClick={handleOrderProductEdit(orderProductKey)}
                      />
                    </Render>
                    <Render renderIf={orderProduct.isEditMode}>
                      <Button
                        icon={'floppy-disk'}
                        intent={Intent.SUCCESS}
                        onClick={handleOrderProductSave(orderProductKey)}
                      />
                    </Render>
                    <Button
                      icon='trash'
                      intent={Intent.DANGER}
                      onClick={handleDeleteButtonClick(orderProduct)}
                    />
                  </ButtonGroup>
                </Row>
              }
            >
              <Row className='w-full align-center flex-between'>
                <section className='flex flex-wrap'>
                  <NumericInput
                    disabled={!orderProduct.isEditMode}
                    label='Quantidade'
                    id={props.screen.id + 'quantity'}
                    placeholder='Quantidade'
                    value={orderProduct.quantity}
                    min={1}
                    onValueChange={onQuantityValueChange}
                  />
                  <InputNumber
                    disabled={!orderProduct.isEditMode}
                    label='Novo valor'
                    id={props.screen.id + 'quantity'}
                    placeholder='0.00'
                    min={0.0}
                    step={0.1}
                    value={price}
                    format='currency'
                    onValueChange={handleQuantityChange(orderProductKey)}
                  />
                </section>

                <section className='flex flex-between'>
                  <InputText
                    readOnly
                    label='Valor por unidade'
                    value={`R$ ${price ?? 0} / ${
                      orderProduct?.product_unit_name
                    }`}
                    id={props.screen.id + 'unit_name'}
                  />
                  <InputText
                    id={props.screen.id + 'total'}
                    readOnly
                    label='Valor total (R$)'
                    value={currencyFormat(
                      (orderProducts?.[orderProductKey]?.quantity ?? 0) *
                      (price ?? 0)
                    )}
                  />
                </section>
              </Row>

              <Row className='w-full flex-between'>
                <TextArea
                  value={orderProduct.description}
                  onChange={handleDescriptionChange(orderProductKey)}
                  disabled={!orderProduct.isEditMode}
                  id={
                    props.screen.id +
                    'order_product' +
                    orderProductKey +
                    '_description'
                  }
                  placeholder='Descrição'
                  style={{ flex: 1 }}
                />
              </Row>
            </Collapse>
          </Box>
        )
      })}
    </Container>
  )
}

export default OrderProductDetails
