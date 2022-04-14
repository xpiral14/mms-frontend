import React, {FunctionComponent, useEffect, useMemo, useState} from 'react'
import {OrderPartDetailsScreenProps, OrderPartItem} from '../../Contracts/Screen/OrderPartDetails'
import useAsync from '../../Hooks/useAsync'
import Render from '../../Components/Render'
import OrderService from '../../Services/OrderService'
import Part from '../../Contracts/Models/Part'
import OrderPartModel from '../../Contracts/Models/OrderPart'
import Container from '../../Components/Layout/Container'
import {Button, ButtonGroup, Intent, ProgressBar, TextArea} from '@blueprintjs/core'
import PartPart from '../../Services/PartsService'
import {useToast} from '../../Hooks/useToast'
import Box from '../../Components/Layout/Box'
import Row from '../../Components/Layout/Row'
import Collapse from '../../Components/Collapse'
import InputText from '../../Components/InputText'
import Bar from '../../Components/Layout/Bar'
import Select from '../../Components/Select'
import {Option} from '../../Contracts/Components/Suggest'
import NumericInput from '../../Components/NumericInput'
import {useAlert} from '../../Hooks/useAlert'
import Empty from '../../Components/Empty'

type SelectedOrderPart = Record<string | number, OrderPartItem>;
const OrderPartDetails: FunctionComponent<OrderPartDetailsScreenProps> = (props) => {
  const {showErrorToast} = useToast()
  const {openAlert} = useAlert()
  const [parts, setParts] = useState<Part[]>([])
  const [orderParts, setOrderParts] = useState<SelectedOrderPart>({})
  const [loadingParts, loadParts] = useAsync(async () => {
    try {
      const partsResponse = await PartPart.getAll(0, 1000)
      setParts(partsResponse.data.data)
    } catch (err) {
      showErrorToast({
        message: 'Não foi possível obter a lista de produtos'
      })
    }
  }, [])

  useEffect(() => {
    if (!props.selectedOrderParts?.length || !parts.length) {
      return
    }
    const defaultValue = {} as SelectedOrderPart
    props.selectedOrderParts.forEach(orderParts => {
      const part = parts.find(s => s.id === orderParts.part_id)
      defaultValue[orderParts.part_id as number] = {
        description: orderParts.description,
        id: orderParts.id,
        isCollapsed: true,
        isEditMode: false,
        order_id: orderParts.order_id,
        quantity: orderParts.quantity,
        replaced_price: orderParts.replaced_price,
        part_id: orderParts.part_id,
        part_name: part?.name,
        part_price: part?.price,
        part_unit_id: part?.unit_id,
        part_unit_name: part?.unit_name
      }
    })

    setOrderParts(defaultValue)
  }, [parts, props.selectedOrderParts])
  const partOptions: Option[] = useMemo(() => {

    const options = parts.filter(s => !Object.keys(orderParts).includes(String(s.id))).map((s) => ({
      label: s.name,
      value: s.id,
      intent: Intent.PRIMARY
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0
    }
    return options.length ? [firstOption, ...options] : []
  }, [parts, orderParts])

  const [loadingOrderParts] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderPartsResponse = await OrderService.getOrderParts(props.order.id)
    const OrderPartsByKey = {} as SelectedOrderPart

    orderPartsResponse.data.data.forEach(orderPart => {
      OrderPartsByKey[orderPart.part.id!] = {
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
        part_unit_name: orderPart?.part?.unit_name
      } as OrderPartItem
    })

    setOrderParts(OrderPartsByKey)
  }, [])

  const changeOrderPartItem = (partId: string | number, attributes: OrderPartItem) => {
    setOrderParts(prev => ({
      ...prev,
      [partId]: {
        ...prev[partId],
        ...attributes
      }
    }))
  }


  const removeOrderPart = (partId: number) => {
    setOrderParts(prev => {
      const copy = {...prev}
      delete copy[partId]

      return copy
    })
  }

  function restoreOrderPartAtState(orderPart: OrderPartItem) {
    setOrderParts(prev => ({
      ...prev,
      [orderPart.part_id as number]: orderPart
    }))
  }

  const handleDeleteOrderPart = (orderPart: OrderPartItem) => {
    const onError = () => {
      showErrorToast({
        message: 'Não foi possível excluir o produto '
          + orderPart.part_name +
          ' da ordem de serviço. Por favor, tente novamente'
      })
      restoreOrderPartAtState(orderPart)
    }
    if (props?.order?.id && orderPart?.id) {
      OrderService.deleteOrderPart(props!.order.id, orderPart.id).catch(onError)
    }
    removeOrderPart(orderPart.part_id as number)
  }

  const handleDeleteButtonClick = (orderPart: OrderPartItem) => (event: any) => {
    event.stopPropagation()

    openAlert({
      text: 'Tem certeza que deseja remover o produto?',
      icon: 'trash',
      onConfirm: () => handleDeleteOrderPart(orderPart),
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar remoção do produto',
      intent: Intent.DANGER
    })
  }

  function toOrderPartModel(orderPartItem: OrderPartItem) {
    return {
      id: orderPartItem?.id,
      order_id: props?.order?.id,
      replaced_price: orderPartItem.replaced_price,
      part_id: orderPartItem.part_id,
      quantity: orderPartItem.quantity,
      description: orderPartItem.description
    } as Partial<OrderPartModel>
  }

  const alertThatHasUnsavedOrderPartItems = (onConfirm: () => void) => {
    openAlert({
      text: 'Quando a tela fechar os produtos não salvos não serão modificados. Deseja prosseguir?',
      intent: 'warning',
      icon: 'warning-sign',
      onConfirm,
    })
  }

  const orderPartValues = useMemo(
    () => Object.values(orderParts),
    [orderParts]
  )
  const hasUnsavedOrderPartItems = useMemo(
    () => orderPartValues.some(s => s.isEditMode),
    [orderParts]
  )

  const handleButtonSave = () => {
    const savedOrderParts = Object.values(orderParts)
      .filter(s => !s.isEditMode)
      .map(toOrderPartModel as any) as OrderPartModel[]

    const onConfirm = () => props.onSave?.(
      savedOrderParts,
      props.screen
    )

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

  const handlePartSelect = (option: Option) => {
    if (!option.value) return
    if (orderParts[option.value]) {
      setOrderParts(prev => {
        const copy = {...prev}
        if(option?.value)
          delete copy[option.value]
        return copy
      })
      return
    }
    const part = parts.find(s => s.id === option.value)!
    const OrderPart: OrderPartItem = {
      id: undefined,
      order_id: props?.order?.id ?? undefined,
      part_id: option.value as number,
      description: undefined,
      quantity: 1,
      replaced_price: undefined,
      part_name: part.name,
      part_price: part.price,
      part_unit_name: part?.unit_name,
      part_unit_id: part.unit_id,
      isEditMode: true,
      isCollapsed: false
    }
    setOrderParts(prev => ({
      ...prev,
      [part.id]: OrderPart
    }))
  }

  const handleOrderPartSave = (orderPartItem: OrderPartItem) => (event: any) => {
    event.stopPropagation()

    const orderId = props.order?.id

    const onErrorRequest = () => {
      showErrorToast({
        message: 'Não foi possível salvar a produto'
      })
      changeOrderPartItem(orderPartItem.part_id!, {
        isEditMode: true
      })
    }
    const orderPart = toOrderPartModel(orderPartItem)
    if (orderId && !orderPartItem.id) {
      OrderService.addPart(orderId, orderPartItem)
        .then((response) => {
          changeOrderPartItem(orderPartItem.part_id!, {
            id: response.data.data.id
          })
        })
        .catch(onErrorRequest)
    }

    if (orderId && orderPartItem.id) {
      OrderService.editPart(orderId, orderPart).catch(onErrorRequest)
    }

    setOrderParts(prev => {
      const partId = orderPartItem.part_id
      const prevOrderPart = prev[partId as number]
      return ({
        ...prev,
        [partId as number]: {
          ...prevOrderPart,
          isEditMode: false
        }
      })
    })
  }

  const handleOrderPartEdit = (OrderPartItem: OrderPartItem) => (event: any) => {
    event.stopPropagation()
    changeOrderPartItem(OrderPartItem.part_id!, {
      isCollapsed: false,
      isEditMode: true
    })
  }
  const handleQuantityChange = (partId: string) => (value: number) => {
    changeOrderPartItem(partId, {
      replaced_price: value
    })
  }

  const handleDescriptionChange = (partId: string) => (event: any) => {
    changeOrderPartItem(partId, {
      description: event.target.value
    })
  }

  return <Container>
    <Row className='w-100 mb-2'>
      <Bar style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button
          intent={Intent.SUCCESS}
          icon='floppy-disk'
          onClick={handleButtonSave}
        >
          Salvar
        </Button>

        <Button icon='log-out' intent={Intent.NONE} onClick={handleButtonExit}>
          Sair
        </Button>
      </Bar>
    </Row>
    <Select
      buttonProps={
        {
          className: 'w-100',
          style: {
            display: 'flex',
            justifyContent: 'space-between'
          }
        } as any
      }
      onChange={handlePartSelect}
      id=""
      items={partOptions}
      loading={loadingParts}
      handleButtonReloadClick={loadParts}
    />
    <Render renderIf={loadingOrderParts}>
      <ProgressBar intent={Intent.SUCCESS} />
    </Render>
    <Render renderIf={!orderPartValues.length && !loadingOrderParts}>
      <Empty/>
    </Render>
    {Object.keys(orderParts).map((partKey) => {
      const orderPart = orderParts[partKey]
      const price = orderPart.replaced_price ?? orderPart.part_price
      const onCollapseChange = () => setOrderParts(prev => {
        const prevPart = orderPart
        return ({
          ...prev,
          [partKey]: {
            ...prevPart,
            isCollapsed: !prevPart.isCollapsed
          }
        })
      })
      const onQuantityValueChange = (value: any) => {
        changeOrderPartItem(partKey, {
          quantity: value
        })
      }
      return <Box key={partKey} style={{marginBottom: 10}}>
        <Collapse
          bordered
          isCollapsed={orderPart.isCollapsed}
          onChange={onCollapseChange}
          title={
            <Row className="flex-between w-100">
              <span>{orderPart.part_name}</span>
              <ButtonGroup>
                <Render renderIf={!orderPart.isEditMode}>
                  <Button
                    icon='edit'
                    intent={Intent.NONE}
                    onClick={handleOrderPartEdit(orderPart)}
                  />
                </Render>
                <Render renderIf={orderPart.isEditMode}>
                  <Button
                    icon={'floppy-disk'}
                    intent={Intent.SUCCESS}
                    onClick={handleOrderPartSave(orderPart)}
                  />

                </Render>
                <Button icon='trash' intent={Intent.DANGER} onClick={handleDeleteButtonClick(orderPart)}/>
              </ButtonGroup>
            </Row>
          }>
          <Row className="w-100 align-center flex-between">
            <section className="flex flex-wrap">
              <NumericInput
                disabled={!orderPart.isEditMode}
                label="Quantidade"
                id={props.screen.id + 'quantity'}
                placeholder="Quantidade"
                value={orderPart.quantity}
                min={1}
                onValueChange={onQuantityValueChange}
              />
              <NumericInput
                leftIcon='bank-account'
                disabled={!orderPart.isEditMode}
                label="Novo valor"
                id={props.screen.id + 'quantity'}
                placeholder="0.00"
                min={0.0}
                stepSize={.1}
                value={price}
                allowNumericCharactersOnly
                clampValueOnBlur
                onValueChange={handleQuantityChange(partKey)}
              />
            </section>

            <section className="flex-between flex">
              <InputText
                readOnly
                label="Valor por unidade"
                value={`R$ ${price ?? 0} / ${orderPart?.part_unit_name}`}
                id={props.screen.id + 'unit_name'}
              />
              <InputText
                id={props.screen.id + 'total'}
                readOnly
                label="Valor total (R$)"
                value={(orderParts?.[partKey]?.quantity ?? 0) * (price ?? 0)}
              />
            </section>
          </Row>

          <Row className="w-100 flex-between">
            <TextArea
              value={orderPart.description}
              onChange={handleDescriptionChange(partKey)}
              disabled={!orderPart.isEditMode}
              id={props.screen.id + 'order_part' + partKey + '_description'}
              placeholder="Descrição"
              style={{flex: 1}}
            />
          </Row>
        </Collapse>
      </Box>
    }
    )}
  </Container>
}

export default OrderPartDetails
