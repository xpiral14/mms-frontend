import React, { FunctionComponent, useMemo, useState } from 'react'
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
import Select from '../../Components/Select'
import { Option } from '../../Contracts/Components/Suggest'
import NumericInput from '../../Components/NumericInput'
import { useAlert } from '../../Hooks/useAlert'
import Empty from '../../Components/Empty'
import Stock from '../../Contracts/Models/Stock'
import ProductStock from '../../Contracts/Models/ProductStock'
import StockService from '../../Services/StockService'
import useMessageError from '../../Hooks/useMessageError'
import ProductStockService from '../../Services/ProductStockService'
import { useWindow } from '../../Hooks/useWindow'
import { uniqueId } from '@blueprintjs/core/lib/esm/common/utils'
import OrderProduct from '../../Contracts/Models/OrderProduct'

const OrderProductDetails: FunctionComponent<OrderProductDetailsScreenProps> = (
  props
) => {
  const { changePayloadAttribute, payload } = useWindow()
  const { showErrorToast } = useToast()
  const { showErrorMessage } = useMessageError()
  const { openAlert } = useAlert()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [productStocks, setProductStocks] = useState<ProductStock[]>([])
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

  const [loadingStocks, loadStocks] = useAsync(async () => {
    try {
      const response = await StockService.getAll(0, 1000)
      setStocks(response.data.data)
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível obter a lista de estoques. Por favor, tente novamente.'
      )
    }
  }, [])

  const [loadingProductStocks, loadProductStocks] = useAsync(async () => {
    try {
      if (!payload.stockId) {
        return
      }
      const response = await ProductStockService.getAll(payload.stockId, 0, 1000)
      setProductStocks(response.data.data)
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível obter a lista de estoques. Por favor, tente novamente.'
      )
    }
  }, [payload.stockId])

  const stockOptions: Option[] = useMemo(() => {
    const options = stocks.map((s) => ({
      label: s.name,
      value: s.id,
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0,
    }
    return options.length ? [firstOption, ...options] : []
  }, [stocks])

  const productStockOptions: Option[] = useMemo(() => {
    const options = productStocks.map((s) => ({
      label: s.product_name!,
      value: s.id,
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0,
    }
    return options.length ? [firstOption, ...options] : []
  }, [productStocks])

  const [loadingOrderProducts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderProductsResponse = await OrderService.getOrderProducts(props.order.id)
    const orderProductItems = orderProductsResponse.data.data.map((orderProduct) => {
      return {
        unique_key: uniqueId('orderProducts'),
        description: orderProduct.order_product.description,
        id: orderProduct.order_product.id,
        isCollapsed: true,
        isEditMode: false,
        order_id: orderProduct.order_product.order_id,
        quantity: orderProduct.order_product.quantity,
        replaced_price: orderProduct.order_product.replaced_price,
        product_id: orderProduct.product.id,
        product_name: orderProduct.product?.name,
        product_price: orderProduct.product?.price,
        product_unit_id: orderProduct.product.unit_id,
        product_unit_name: orderProduct?.product?.unit_name,
      } as OrderProductItem
    })

    setOrderProducts(orderProductItems)
  }, [])

  const changeOrderProductItem = (index: number, attributes: OrderProductItem) => {
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
      OrderService.deleteOrderProduct(props!.order.id, orderProduct.id).catch(onError)
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
            osi = (await OrderService.addProduct(props.order!.id!, osModel)).data
              .data

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

  const handleSelectStock = (option: Option) => {
    changePayloadAttribute('stockId', option.value)
  }
  const handleProductSelect = (option: Option) => {
    if (!option.value) return
    const productStock = productStocks.find((s) => s.id === option.value)!
    const orderProduct: OrderProductItem = {
      id: undefined,
      order_id: props?.order?.id ?? undefined,
      product_id: productStock.product_id as number,
      description: undefined,
      quantity: 1,
      product_stock_id: productStock.id,
      replaced_price: undefined,
      product_name: productStock.product_name,
      product_price: productStock.product_price,
      product_unit_name: productStock?.unit_name,
      product_unit_id: productStock.unit_id,
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
      OrderService.addProduct(orderId, orderProductItem)
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
  const handleQuantityChange = (productStockId: number) => (value: number) => {
    changeOrderProductItem(+productStockId, {
      replaced_price: value,
    })
  }

  const handleDescriptionChange = (productStockId: number) => (event: any) => {
    changeOrderProductItem(+productStockId, {
      description: event.target.value,
    })
  }

  return (
    <Container>
      <Row className='w-100 mb-2'>
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
      <Row>
        <Select
          onChange={handleSelectStock}
          id=''
          label='Estoque'
          items={stockOptions}
          activeItem={payload.stockId}
          loading={loadingStocks}
          handleButtonReloadClick={loadStocks}
        />
        <Select
          onChange={handleProductSelect}
          id=''
          disabled={!payload.stockId}
          label='Produtos no estoque'
          items={productStockOptions}
          loading={loadingProductStocks}
          handleButtonReloadClick={loadProductStocks}
        />
      </Row>
      <Render renderIf={loadingOrderProducts}>
        <ProgressBar intent={Intent.SUCCESS} />
      </Render>
      <Render renderIf={!orderProducts.length && !loadingOrderProducts}>
        <Empty />
      </Render>
      {orderProducts.map((orderProduct, orderProductKey) => {
        const price = orderProduct.replaced_price ?? orderProduct.product_price
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
                <Row className='flex-between w-100'>
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
              <Row className='w-100 align-center flex-between'>
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
                  <NumericInput
                    leftIcon='bank-account'
                    disabled={!orderProduct.isEditMode}
                    label='Novo valor'
                    id={props.screen.id + 'quantity'}
                    placeholder='0.00'
                    min={0.0}
                    stepSize={0.1}
                    value={price}
                    allowNumericCharactersOnly
                    clampValueOnBlur
                    onValueChange={handleQuantityChange(orderProductKey)}
                  />
                </section>

                <section className='flex-between flex'>
                  <InputText
                    readOnly
                    label='Valor por unidade'
                    value={`R$ ${price ?? 0} / ${orderProduct?.product_unit_name}`}
                    id={props.screen.id + 'unit_name'}
                  />
                  <InputText
                    id={props.screen.id + 'total'}
                    readOnly
                    label='Valor total (R$)'
                    value={
                      (orderProducts?.[orderProductKey]?.quantity ?? 0) * (price ?? 0)
                    }
                  />
                </section>
              </Row>

              <Row className='w-100 flex-between'>
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