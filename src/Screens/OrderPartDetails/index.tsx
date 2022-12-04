import React, { FunctionComponent, useMemo, useState } from 'react'
import {
  OrderPartDetailsScreenProps,
  OrderPartItem,
} from '../../Contracts/Screen/OrderPartDetails'
import useAsync from '../../Hooks/useAsync'
import Render from '../../Components/Render'
import OrderService from '../../Services/OrderService'
import OrderPartModel from '../../Contracts/Models/OrderPart'
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
import PartStock from '../../Contracts/Models/PartStock'
import StockService from '../../Services/StockService'
import useMessageError from '../../Hooks/useMessageError'
import PartStockService from '../../Services/PartStockService'
import { useWindow } from '../../Hooks/useWindow'
import { uniqueId } from '@blueprintjs/core/lib/esm/common/utils'
import OrderPart from '../../Contracts/Models/OrderPart'

const OrderPartDetails: FunctionComponent<OrderPartDetailsScreenProps> = (
  props
) => {
  const { changePayloadAttribute, payload } = useWindow()
  const { showErrorToast } = useToast()
  const { showErrorMessage } = useMessageError()
  const { openAlert } = useAlert()
  const [stocks, setStocks] = useState<Stock[]>([])
  const [partStocks, setPartStocks] = useState<PartStock[]>([])
  const [orderParts, setOrderParts] = useState<OrderPartItem[]>(() =>
    (props.selectedOrderParts || []).map((orderPart) => {
      return {
        description: orderPart.description,
        id: orderPart.id,
        unique_key: uniqueId('orderParts'),
        isCollapsed: true,
        isEditMode: false,
        order_id: orderPart.order_id,
        quantity: orderPart.quantity,
        replaced_price: orderPart.replaced_price,
        part_id: orderPart.part_id,
        part_stock_id: orderPart.part_stock_id,
        part_name: orderPart?.part_name,
        part_price: orderPart?.part_price,
        part_unit_id: orderPart?.part_unit_id,
        part_unit_name: orderPart?.part_unit_name,
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

  const [loadingPartStocks, loadPartStocks] = useAsync(async () => {
    try {
      if (!payload.stockId) {
        return
      }
      const response = await PartStockService.getAll(payload.stockId, 0, 1000)
      setPartStocks(response.data.data)
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

  const partStockOptions: Option[] = useMemo(() => {
    const options = partStocks.map((s) => ({
      label: s.part_name!,
      value: s.id,
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0,
    }
    return options.length ? [firstOption, ...options] : []
  }, [partStocks])

  const [loadingOrderParts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderPartsResponse = await OrderService.getOrderParts(props.order.id)
    const orderPartItems = orderPartsResponse.data.data.map((orderPart) => {
      return {
        unique_key: uniqueId('orderParts'),
        description: orderPart.order_part.description,
        id: orderPart.order_part.id,
        isCollapsed: true,
        isEditMode: false,
        order_id: orderPart.order_part.order_id,
        quantity: orderPart.order_part.quantity,
        replaced_price: orderPart.order_part.replaced_price,
        part_id: orderPart.part.id,
        part_name: orderPart.part?.name,
        part_price: orderPart.part?.price,
        part_unit_id: orderPart.part.unit_id,
        part_unit_name: orderPart?.part?.unit_name,
      } as OrderPartItem
    })

    setOrderParts(orderPartItems)
  }, [])

  const changeOrderPartItem = (index: number, attributes: OrderPartItem) => {
    setOrderParts((prev) => {
      const copy = [...prev]
      copy[index as number] = {
        ...prev[index as number],
        ...attributes,
      }

      return copy
    })
  }

  const removeOrderPart = (partStock: OrderPartItem) => {
    setOrderParts((prev) => {
      const copy = [...prev]

      return copy.filter((p) => p.unique_key !== partStock.unique_key)
    })
  }

  function restoreOrderPartAtState(orderPart: OrderPartItem) {
    setOrderParts((prev) => [...prev, orderPart])
  }

  const handleDeleteOrderPart = (orderPart: OrderPartItem) => {
    const onError = () => {
      showErrorToast({
        message:
          'Não foi possível excluir o produto ' +
          orderPart.part_name +
          ' da ordem de serviço. Por favor, tente novamente',
      })
      restoreOrderPartAtState(orderPart)
    }
    if (props?.order?.id && orderPart?.id) {
      OrderService.deleteOrderPart(props!.order.id, orderPart.id).catch(onError)
    }
    removeOrderPart(orderPart)
  }

  const handleDeleteButtonClick =
    (orderPart: OrderPartItem) => (event: any) => {
      event.stopPropagation()
      openAlert({
        text: 'Tem certeza que deseja remover o produto?',
        icon: 'trash',
        onConfirm: () => handleDeleteOrderPart(orderPart),
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar remoção do produto',
        intent: Intent.DANGER,
      })
    }

  function toOrderPartModel(orderPartItem: OrderPartItem) {
    return {
      id: orderPartItem?.id,
      order_id: props?.order?.id,
      replaced_price: orderPartItem.replaced_price,
      part_stock_id: orderPartItem.part_stock_id,
      quantity: orderPartItem.quantity,
      description: orderPartItem.description,
      part_id: orderPartItem.part_id,
      part_name: orderPartItem.part_name,
      part_unit_name: orderPartItem.part_unit_name,
      part_unit_id: orderPartItem.part_unit_id,
      part_price: orderPartItem.part_price,
    } as Partial<OrderPartModel>
  }

  const alertThatHasUnsavedOrderPartItems = (onConfirm: () => void) => {
    openAlert({
      text: 'Tem certeza que deseja salvar todos?',
      intent: 'warning',
      icon: 'warning-sign',
      onConfirm,
    })
  }

  const hasUnsavedOrderPartItems = useMemo(
    () => orderParts.some((s) => s.isEditMode),
    [orderParts]
  )

  const handleButtonSave = () => {
    const savedOrderParts = Object.values(orderParts).filter(
      (s) => !s.isEditMode
    )

    const onConfirm = async () => {
      const unSavedOrderServices = Object.values(orderParts).filter(
        (s) => s.isEditMode
      )
      try {
        if (!props.order?.id) {
          props.onSave?.(
            orderParts.map(toOrderPartModel) as OrderPart[],
            props.screen
          )
          return
        }
        await Promise.all(
          unSavedOrderServices.map(async (osi) => {
            const osModel = toOrderPartModel(osi)
            if (osi.id) {
              await OrderService.editPart(props.order!.id!, osModel)
              return
            }
            osi = (await OrderService.addPart(props.order!.id!, osModel)).data
              .data

            savedOrderParts.push({
              ...osi,
              isEditMode: false,
            })
          })
        )

        const items: Record<string, OrderPartItem> = {}

        savedOrderParts.forEach((os) => {
          items[os.unique_key!] = os
        })

        const newOrderPartItems = orderParts.map((orderPart) => {
          return items[orderPart.unique_key!] ?? orderPart
        })

        setOrderParts(newOrderPartItems)

        props.onSave?.(
            newOrderPartItems.map(toOrderPartModel) as OrderPart[],
            props.screen
        )
      } catch (error: any) {
        showErrorToast({
          message:
            'Não foi possível salvar todas os serviços da ordem ainda não salvos. Por favor, tente novamente!',
        })
      }
    }

    if (hasUnsavedOrderPartItems) {
      alertThatHasUnsavedOrderPartItems(onConfirm)
      return
    }

    onConfirm()
  }

  const handleButtonExit = () => {
    const onConfirm = () => props.screen.close()
    if (hasUnsavedOrderPartItems) {
      alertThatHasUnsavedOrderPartItems(onConfirm)
      return
    }
    onConfirm()
  }

  const handleSelectStock = (option: Option) => {
    changePayloadAttribute('stockId', option.value)
  }
  const handlePartSelect = (option: Option) => {
    if (!option.value) return
    const partStock = partStocks.find((s) => s.id === option.value)!
    const orderPart: OrderPartItem = {
      id: undefined,
      order_id: props?.order?.id ?? undefined,
      part_id: partStock.part_id as number,
      description: undefined,
      quantity: 1,
      part_stock_id: partStock.id,
      replaced_price: undefined,
      part_name: partStock.part_name,
      part_price: partStock.part_price,
      part_unit_name: partStock?.unit_name,
      part_unit_id: partStock.unit_id,
      isEditMode: true,
      isCollapsed: false,
      unique_key: uniqueId('orderParts'),
    }
    setOrderParts((prev) => [...prev, orderPart])
  }

  const handleOrderPartSave = (orderPartKey: number) => (event: any) => {
    event.stopPropagation()
    const orderPartItem = orderParts[orderPartKey]

    const orderId = props.order?.id

    const onErrorRequest = (error: any) => {
      showErrorMessage(error, 'Não foi possível salvar a produto')
      changeOrderPartItem(orderPartKey, {
        isEditMode: true,
      })
    }
    const orderPart = toOrderPartModel(orderPartItem)
    if (orderId && !orderPartItem.id) {
      OrderService.addPart(orderId, orderPartItem)
        .then((response) => {
          changeOrderPartItem(orderPartKey, {
            id: response.data.data.id,
          })
        })
        .catch(onErrorRequest)
    }

    if (orderId && orderPartItem.id) {
      OrderService.editPart(orderId, orderPart).catch(onErrorRequest)
    }

    setOrderParts((prev) => {
      const copy = [...prev]
      copy[orderPartKey] = {
        ...copy[orderPartKey],
        isEditMode: false,
      }
      return copy
    })
  }

  const handleOrderPartEdit = (orderPartKey: number) => (event: any) => {
    event.stopPropagation()
    changeOrderPartItem(orderPartKey, {
      isCollapsed: false,
      isEditMode: true,
    })
  }
  const handleQuantityChange = (partStockId: number) => (value: number) => {
    changeOrderPartItem(+partStockId, {
      replaced_price: value,
    })
  }

  const handleDescriptionChange = (partStockId: number) => (event: any) => {
    changeOrderPartItem(+partStockId, {
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
          onChange={handlePartSelect}
          id=''
          disabled={!payload.stockId}
          label='Produtos no estoque'
          items={partStockOptions}
          loading={loadingPartStocks}
          handleButtonReloadClick={loadPartStocks}
        />
      </Row>
      <Render renderIf={loadingOrderParts}>
        <ProgressBar intent={Intent.SUCCESS} />
      </Render>
      <Render renderIf={!orderParts.length && !loadingOrderParts}>
        <Empty />
      </Render>
      {orderParts.map((orderPart, orderPartKey) => {
        const price = orderPart.replaced_price ?? orderPart.part_price
        const onCollapseChange = () =>
          setOrderParts((prev) => {
            const copy = [...prev]
            copy[orderPartKey] = {
              ...copy[orderPartKey],
              isCollapsed: !copy[orderPartKey].isCollapsed,
            }
            return copy
          })
        const onQuantityValueChange = (value: any) => {
          changeOrderPartItem(orderPartKey, {
            quantity: value,
          })
        }
        return (
          <Box key={orderPartKey} style={{ marginBottom: 10 }}>
            <Collapse
              bordered
              isCollapsed={orderPart.isCollapsed}
              onChange={onCollapseChange}
              title={
                <Row className='flex-between w-100'>
                  <span>{orderPart.part_name}</span>
                  <ButtonGroup>
                    <Render renderIf={!orderPart.isEditMode}>
                      <Button
                        icon='edit'
                        intent={Intent.NONE}
                        onClick={handleOrderPartEdit(orderPartKey)}
                      />
                    </Render>
                    <Render renderIf={orderPart.isEditMode}>
                      <Button
                        icon={'floppy-disk'}
                        intent={Intent.SUCCESS}
                        onClick={handleOrderPartSave(orderPartKey)}
                      />
                    </Render>
                    <Button
                      icon='trash'
                      intent={Intent.DANGER}
                      onClick={handleDeleteButtonClick(orderPart)}
                    />
                  </ButtonGroup>
                </Row>
              }
            >
              <Row className='w-100 align-center flex-between'>
                <section className='flex flex-wrap'>
                  <NumericInput
                    disabled={!orderPart.isEditMode}
                    label='Quantidade'
                    id={props.screen.id + 'quantity'}
                    placeholder='Quantidade'
                    value={orderPart.quantity}
                    min={1}
                    onValueChange={onQuantityValueChange}
                  />
                  <NumericInput
                    leftIcon='bank-account'
                    disabled={!orderPart.isEditMode}
                    label='Novo valor'
                    id={props.screen.id + 'quantity'}
                    placeholder='0.00'
                    min={0.0}
                    stepSize={0.1}
                    value={price}
                    allowNumericCharactersOnly
                    clampValueOnBlur
                    onValueChange={handleQuantityChange(orderPartKey)}
                  />
                </section>

                <section className='flex-between flex'>
                  <InputText
                    readOnly
                    label='Valor por unidade'
                    value={`R$ ${price ?? 0} / ${orderPart?.part_unit_name}`}
                    id={props.screen.id + 'unit_name'}
                  />
                  <InputText
                    id={props.screen.id + 'total'}
                    readOnly
                    label='Valor total (R$)'
                    value={
                      (orderParts?.[orderPartKey]?.quantity ?? 0) * (price ?? 0)
                    }
                  />
                </section>
              </Row>

              <Row className='w-100 flex-between'>
                <TextArea
                  value={orderPart.description}
                  onChange={handleDescriptionChange(orderPartKey)}
                  disabled={!orderPart.isEditMode}
                  id={
                    props.screen.id +
                    'order_part' +
                    orderPartKey +
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

export default OrderPartDetails
