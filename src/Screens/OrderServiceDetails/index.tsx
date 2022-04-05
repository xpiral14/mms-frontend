import React, {FunctionComponent, useMemo, useState} from 'react'
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
      orderServicesByKey[orderService.id] = orderService
    })

    setOrderServices(orderServicesByKey)
  }, [])

  const changeOrderServiceItem = (serviceId: string, attributes: OrderServiceItem) => {
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
  function toOrderServiceModel(orderServiceItem: OrderServiceItem){
    return {
      id: undefined,
      order_id: props?.order?.id,
      replaced_price: orderServiceItem.replaced_price,
      service_id: orderServiceItem.service_id,
      quantity: orderServiceItem.quantity,
      description: orderServiceItem.description
    } as Partial<OrderServiceModel>
  }
  return <Container>
    <Row className='w-100 mb-2'>
      <Bar style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button
          intent={Intent.SUCCESS}
          icon='floppy-disk'
          onClick={() => props?.onSave?.(Object.values(orderServices).map(toOrderServiceModel as any), props.screen)}
        >
          Salvar
        </Button>

        <Button icon='log-out' intent={Intent.NONE}  onClick={() => props.screen.close()}>
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
      onChange={(item) => {
        if (!item.value) return
        if (orderServices[item.value]) {
          setOrderServices(prev => {
            const copy = {...prev}
            delete copy[item.value]
            return copy
          })
          return
        }
        const service = services.find(s => s.id === item.value)!
        const orderService: OrderServiceItem = {
          id: undefined,
          order_id: props?.order?.id ?? undefined,
          service_id: item.value as number,
          description: undefined,
          quantity: 1,
          replaced_price: undefined,
          service_name: service.name,
          service_price: service.price,
          service_unit_name: service?.unit_name,
          service_unit_id: service.unit_id

        }
        setOrderServices(prev => ({
          ...prev,
          [service.id]: orderService
        }))
      }}
      id=""
      items={serviceOptions}
      loading={loadingServices}
      handleButtonReloadClick={loadServices}
    />
    <Render renderIf={Boolean(props?.order?.id && !orderServices.length && !loadingOrderServices)}>
      Não existe serviços para a ordem atual
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
                <Button
                  icon={orderService.isEditMode ? 'floppy-disk' : 'edit'}
                  intent={orderService.isEditMode ? Intent.SUCCESS : Intent.NONE}
                  onClick={(event: any) => {
                    event.stopPropagation()
                    setOrderServices(prev => {
                      const prevOrderService = prev[serviceKey]
                      return ({
                        ...prev,
                        [serviceKey]: {
                          ...prevOrderService,
                          isCollapsed: false,
                          isEditMode: prevOrderService.isCollapsed || !prevOrderService.isEditMode
                        }
                      })
                    })
                  }
                  }/>
                <Button icon='trash' intent={Intent.DANGER} onClick={handleDeleteButtonClick(+serviceKey)}/>
              </ButtonGroup>
            </Row>
          }>
          <Row style={{width: '100%', alignItems: 'center', justifyContent: 'space-between'}}>
            <section style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap'
            }}>
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
                onValueChange={value => {
                  changeOrderServiceItem(serviceKey, {
                    replaced_price: parseFloat(String(value))
                  })
                }}
              />
            </section>

            <section className="flex-between flex">
              <InputText
                readOnly
                style={{
                  width: 100
                }}
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
              onChange={event => changeOrderServiceItem(serviceKey, {
                description: event.target.value
              })}
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
