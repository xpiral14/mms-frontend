import React, {FunctionComponent, useEffect, useMemo, useState} from 'react'
import {
  OrderServiceDetailScreenProps,
  OrderServiceItem
} from '../../Contracts/Screen/OrderServiceDetails/OrderServiceDetailsProps'
import useAsync from '../../Hooks/useAsync'
import Render from '../../Components/Render'
import OrderService from '../../Services/OrderService'
import Service from '../../Contracts/Models/Service'
import OrderServiceModel from '../../Contracts/Models/OrderService'
import Container from '../../Components/Layout/Container'
import {Button, ButtonGroup, Intent, TextArea} from '@blueprintjs/core'
import ServiceService from '../../Services/ServiceService'
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

type SelectedOrderService = Record<string | number, OrderServiceItem>;
const OrderServiceDetails: FunctionComponent<OrderServiceDetailScreenProps> = (props) => {
  const {showErrorToast} = useToast()
  const {openAlert} = useAlert()
  const [services, setServices] = useState<Service[]>([])
  const [orderServices, setOrderServices] = useState<SelectedOrderService>({})
  const [loadingServices, loadServices] = useAsync(async () => {
    try {
      const servicesResponse = await ServiceService.getAll(0, 20)
      setServices(servicesResponse.data.data.map(s => ({
        ...s,
        unit_id: 1,
        unit_name: 'Hora',
        price: 20
      })))
    } catch (err) {
      showErrorToast({
        message: 'Não foi possível obter a lista de serviços'
      })
    }
  }, [])

  useEffect(() => {
    if(!props.selectedOrderServices?.length || !services.length){
      return
    }    
    const defaultValue = {} as SelectedOrderService
    props.selectedOrderServices.forEach(orderServiceItem => {
      const service = services.find(s => s.id === orderServiceItem.service_id)
      defaultValue[orderServiceItem.service_id as number] = {
        description: orderServiceItem.description,
        id: orderServiceItem.id,
        isCollapsed: true,
        isEditMode: false,
        order_id: orderServiceItem.order_id,
        quantity: orderServiceItem.quantity,
        replaced_price: orderServiceItem.replaced_price,
        service_id: orderServiceItem.service_id,
        service_name: service?.name,
        service_price: service?.price,
        service_unit_id: 1,
        service_unit_name: 'Hora'
      }
    })
  
    setOrderServices(defaultValue)
  }, [services, props.selectedOrderServices])
  const serviceOptions: Option[] = useMemo(() => {

    const options = services.filter(s => !Object.keys(orderServices).includes(String(s.id))).map((s) => ({
      label: s.name,
      value: s.id,
      intent: Intent.PRIMARY
    }))
    const firstOption = {
      label: 'Selecionar serviços',
      value: 0
    }
    return options.length ? [firstOption, ...options] : []
  }, [services, orderServices])

  const [loadingOrderServices] = useAsync(async () => {
    if (!props?.order?.id) return
    const orderServicesResponse = await OrderService.getOrderServices(props.order.id)
    const orderServicesByKey = {} as any

    orderServicesResponse.data.data.forEach(orderService => {
      orderServicesByKey[orderService.service.id!] = orderService
    })

    setOrderServices(orderServicesByKey)
  }, [])

  const changeOrderServiceItem = (serviceId: string | number, attributes: OrderServiceItem) => {
    setOrderServices(prev => ({
      ...prev,
      [serviceId]: {
        ...prev[serviceId],
        ...attributes
      }
    }))
  }

  const deleteOrderServiceUsingApi = (orderService: OrderServiceItem) => {
    OrderService.deleteOrderService(props!.order!.id!, orderService.id!)
  }


  const removeOrderService = (serviceId: number) => {
    setOrderServices(prev => {
      const copy = {...prev}
      delete copy[serviceId]

      return copy
    })
  }
  const handleDeleteOrderService = (serviceId: number) => {
    const orderService = orderServices[serviceId]

    if (props?.order?.id && orderService.id) {
      deleteOrderServiceUsingApi(orderService)
      return
    }

    removeOrderService(serviceId)
  }

  const handleDeleteButtonClick = (serviceId: number) => (event: any) => {
    event.stopPropagation()

    openAlert({
      text: 'Tem certeza que deseja remover o serviço?',
      icon: 'trash',
      onConfirm: () => handleDeleteOrderService(serviceId),
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Confirmar remoção do serviço',
      intent: Intent.DANGER
    })
  }

  function toOrderServiceModel(orderServiceItem: OrderServiceItem) {
    return {
      id: undefined,
      order_id: props?.order?.id,
      replaced_price: orderServiceItem.replaced_price,
      service_id: orderServiceItem.service_id,
      quantity: orderServiceItem.quantity,
      description: orderServiceItem.description
    } as Partial<OrderServiceModel>
  }

  const alertThatHasUnsavedOrderServiceItems = (onConfirm: () => void) => {
    openAlert({
      text: 'Quando a tela fechar os serviços não salvos não serão modificados. Deseja prosseguir?',
      intent: 'warning',
      icon: 'warning-sign',
      onConfirm,
    })
  }

  const orderServiceValues = useMemo(
    () => Object.values(orderServices),
    [orderServices]
  )
  const hasUnsavedOrderServiceItems = useMemo(
    () => orderServiceValues.some(s => s.isEditMode),
    [orderServices]
  )

  const handleButtonSave = () => {
    const savedOrderServices = Object.values(orderServices)
      .filter(s => !s.isEditMode)
      .map(toOrderServiceModel as any) as OrderServiceModel[]

    const onConfirm = () => props.onSave?.(
      savedOrderServices,
      props.screen
    )

    if (hasUnsavedOrderServiceItems) {
      alertThatHasUnsavedOrderServiceItems(onConfirm)
      return
    }

    onConfirm()
  }

  const handleButtonExit = () => {
    const onConfirm = () => props.screen.close()
    if(hasUnsavedOrderServiceItems){
      alertThatHasUnsavedOrderServiceItems(onConfirm)
      return
    }
    onConfirm()
  }

  const handleServiceSelect = (option: Option) => {
    if (!option.value) return
    if (orderServices[option.value]) {
      setOrderServices(prev => {
        const copy = {...prev}
        if (option.value) {
          delete copy[option.value]
        }
        return copy
      })
      return
    }
    const service = services.find(s => s.id === option.value)!
    const orderService: OrderServiceItem = {
      id: undefined,
      order_id: props?.order?.id ?? undefined,
      service_id: option.value as number,
      description: undefined,
      quantity: 1,
      replaced_price: undefined,
      service_name: service.name,
      service_price: service.price,
      service_unit_name: service?.unit_name,
      service_unit_id: service.unit_id,
      isEditMode: false,
      isCollapsed: true
    }
    setOrderServices(prev => ({
      ...prev,
      [service.id]: orderService
    }))
  }

  const handleOrderServiceSave = (orderServiceItem: OrderServiceItem) => (event: any) => {
    event.stopPropagation()

    const orderId = props.order?.id

    const onErrorRequest = () => {
      showErrorToast({
        message: 'Não foi possível salvar o serviço'
      })
      changeOrderServiceItem(orderServiceItem.service_id!, {
        isCollapsed: false,
        isEditMode: true
      })
    }
    const orderService = toOrderServiceModel(orderServiceItem)

    if (orderId && !orderServiceItem.id) {
      OrderService.addService(orderId, orderService).catch(onErrorRequest)
    }

    if (orderId && orderServiceItem.id) {
      OrderService.editService(orderId, orderService).catch(onErrorRequest)
    }

    setOrderServices(prev => {
      const serviceId = orderServiceItem.service_id
      const prevOrderService = prev[serviceId as number]
      return ({
        ...prev,
        [serviceId as number]: {
          ...prevOrderService,
          isCollapsed: false,
          isEditMode: prevOrderService.isCollapsed || !prevOrderService.isEditMode
        }
      })
    })
  }

  const handleOrderServiceEdit = (orderServiceItem: OrderServiceItem) => (event: any) => {
    event.stopPropagation()
    changeOrderServiceItem(orderServiceItem.service_id!, {
      isCollapsed: false,
      isEditMode: true
    })
  }
  const handleQuantityChange = (serviceId: string) => (value: number) => {
    changeOrderServiceItem(serviceId, {
      replaced_price: value
    })
  }

  const handleDescriptionChange = (serviceId: string) => (event: any) => {
    changeOrderServiceItem(serviceId, {
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
      fill
      onChange={handleServiceSelect}
      id=""
      items={serviceOptions}
      loading={loadingServices}
      handleButtonReloadClick={loadServices}
    />
    <Render renderIf={Boolean(props?.order?.id && !Object.keys(orderServices).length && !loadingOrderServices)}>
      Não existe serviços para a ordem atual
    </Render>
    <Render renderIf={!orderServiceValues.length && !loadingOrderServices}>
      <Empty />
    </Render>
    {Object.keys(orderServices).map((serviceKey) => {
      const orderService = orderServices[serviceKey]
      const price = orderService.replaced_price ?? orderService.service_price
      return <Box key={serviceKey} style={{marginBottom: 10}}>
        <Collapse
          bordered
          isCollapsed={orderService.isCollapsed}
          onChange={() => setOrderServices(prev => {
            const prevService = orderService
            return ({
              ...prev,
              [serviceKey]: {
                ...prevService,
                isCollapsed: !prevService.isCollapsed
              }
            })
          })}
          title={
            <Row className="flex-between w-100">
              <span>{orderService.service_name}</span>
              <ButtonGroup>
                <Render renderIf={!orderService.isEditMode}>
                  <Button
                    icon='edit'
                    intent={Intent.NONE}
                    onClick={handleOrderServiceEdit(orderService)}
                  />
                </Render>
                <Render renderIf={orderService.isEditMode}>
                  <Button
                    icon={'floppy-disk'}
                    intent={Intent.SUCCESS}
                    onClick={handleOrderServiceSave(orderService)}
                  />

                </Render>
                <Button icon='trash' intent={Intent.DANGER} onClick={handleDeleteButtonClick(+serviceKey)}/>
              </ButtonGroup>
            </Row>
          }>
          <Row className="w-100 align-center flex-between">
            <section className="flex flex-wrap">
              <NumericInput
                disabled={!orderService.isEditMode}
                label="Quantidade"
                id={props.screen.id + 'quantity'}
                placeholder="Quantidade"
                value={orderService.quantity}
                min={1}
                onValueChange={value => {
                  changeOrderServiceItem(serviceKey, {
                    quantity: value
                  })
                }}
              />
              <NumericInput
                leftIcon='bank-account'
                disabled={!orderService.isEditMode}
                label="Novo valor"
                id={props.screen.id + 'quantity'}
                placeholder="0.00"
                min={0.0}
                stepSize={.1}
                value={price}
                allowNumericCharactersOnly
                clampValueOnBlur
                onValueChange={handleQuantityChange(serviceKey)}
              />
            </section>

            <section className="flex-between flex">
              <InputText
                readOnly
                label="Valor por unidade"
                value={`R$ ${price ?? 0} / ${orderService?.service_unit_name}`}
                id={props.screen.id + 'unit_name'}
              />
              <InputText
                id={props.screen.id + 'total'}
                readOnly
                label="Valor total (R$)"
                value={(orderServices?.[serviceKey]?.quantity ?? 0) * (price ?? 0)}
              />
            </section>
          </Row>

          <Row className="w-100 flex-between">
            <TextArea
              value={orderService.description}
              onChange={handleDescriptionChange(serviceKey)}
              disabled={!orderService.isEditMode}
              id={props.screen.id + 'order_service' + serviceKey + '_description'}
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

export default OrderServiceDetails
