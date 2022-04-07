import {Intent, TextArea,} from '@blueprintjs/core'
import {Cell} from '@blueprintjs/table'
import React, {useEffect, useMemo, useState} from 'react'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Select from '../../../Components/Select'
import {orderStatus, PersonType, ScreenStatus} from '../../../Constants/Enums'
import {RegistrationButtonBarProps, StopLoadFunc} from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import {Option} from '../../../Contracts/Components/Suggest'
import {Validation} from '../../../Contracts/Hooks/useValidation'
import Costumer from '../../../Contracts/Models/Costumer'
import Order from '../../../Contracts/Models/Order'
import Service from '../../../Contracts/Models/Service'
import OrderServiceModel from '../../../Contracts/Models/OrderService'
import {useAlert} from '../../../Hooks/useAlert'
import useAsync from '../../../Hooks/useAsync'
import {useGrid} from '../../../Hooks/useGrid'
import {useScreen} from '../../../Hooks/useScreen'
import {useToast} from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import {useWindow} from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import OrderService from '../../../Services/OrderService'
import {Body, Container, Header} from './style'
import {addSeconds} from 'date-fns'
import Button from '../../../Components/Button'
import InputText from '../../../Components/InputText'
import Render from '../../../Components/Render'
import InputDate from '../../../Components/InputDate'
import Collapse from '../../../Components/Collapse'
import Row from '../../../Components/Layout/Row'
import {OrderServiceDetailsProps} from '../../../Contracts/Screen/OrderServiceDetails/OrderServiceDetailsProps'
import {OrderPartDetailsProps} from '../../../Contracts/Screen/OrderPartDetails'
import OrderPart from '../../../Contracts/Models/OrderPart'
import Box from '../../../Components/Layout/Box'

const orderStatusOptions: Option[] = [
  {
    value: orderStatus.PENDING,
    label: 'Pendente',
    intent: Intent.NONE
  },
  {
    value: orderStatus.EXECUTING,
    label: 'Executando',
    intent: Intent.PRIMARY
  },
  {
    value: orderStatus.EXECUTED,
    label: 'Executada',
    intent: Intent.SUCCESS

  },
  {
    value: orderStatus.CANCELED,
    label: 'Cancelada',
    intent: Intent.DANGER
  }
]

type OrderPayload = {
  id?: number
  serviceIds: number[],
  partIds: number[]
  costumer_id?: number
  description?: string,
  date: Date,
  reference: string,
  estimated_date: Date,
  services?: OrderServiceModel[],
  parts?: OrderPart[]
};
const OrderServiceCostumer: React.FC<ScreenProps> = ({ screen }) => {
  const [costumers, setCostumer] = useState<Costumer[]>([])
  const [isTableCollapsed, setIsTableCollapsed] = useState(true)
  const [isDetailsCollapsed, setIsDetailsCollapsed] = useState(true)


  const costumerOptions = useMemo(() => {
    const normalized = {
      options: [] as Option[],
      keyValue: {} as { [x: number]: Option },
    }
    costumers.forEach((costumer) => {
      const option = {
        label: costumer.name,
        value: costumer.id,
      }
      normalized.options.push(option)

      normalized.keyValue[option.value] = option
    })
    return normalized
  }, [costumers])

  const [loadingCostumers, loadCostumers] = useAsync(async () => {
    try {
      const response = await CostumerService.getAll(1, 100)
      setCostumer(response.data.data as Costumer[])
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter lista de clientes',
      })
    }
  }, [])

  const {payload, setPayload, screenStatus, setScreenStatus} = useWindow<OrderPayload>()
  const isStatusVisualize =
    Boolean(screenStatus === ScreenStatus.VISUALIZE)
  useEffect(() => {
    changePayload('date', new Date())
  }, [])
  const changePayload = (key: keyof typeof payload, value: any) => {
    setPayload(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const createValidation = (keyName: keyof typeof payload) => () => {
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
      check: createValidation('costumer_id'),
      errorMessage: 'Escolha o cliente',
      inputId: `${screen.id}-select-costumer`,
    }
  ]
  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()
  const { openSubScreen } = useScreen()

  const reloadAllScreenData = () => {
    loadCostumers()
    setReloadGrid(true)
  }

  const openOrderServicePiecesScreen = () => {
    console.log('hello world')
  }
  const saveAction = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const requestPayload = {
        date: '',
        estimated_date: payload.estimated_date,
        reference: payload.reference, 
        costumerId: payload.costumer_id!,
        description: payload?.description,
        partIds: [] as number[],
        serviceIds: [] as number[]
      }
      const response = await OrderService.create(requestPayload)
      const orderId = response.data.data.id
      setReloadGrid(true)

      Promise.all((payload.services || [])?.map((orderService) => OrderService.addService(orderId, orderService)))

      openAlert({
        text: 'Você deseja adicionar os produtos do serviço?',
        intent: Intent.SUCCESS,
        icon: 'add',
        confirmButtonText: 'Sim',
        canOutsideClickCancel: true,
      })
    } catch (error) {
      console.log(error)
      showErrorToast({
        message: 'Erro ao criar ordem serviço. Por favor, tente novamente.',
      })
    } finally {
      stopLoad()
    }

    showSuccessToast({
      message: 'Ordem de serviço criada com sucesso!',
    })
  }

  const updateAction = (stopLoad: StopLoadFunc) => {
    stopLoad()
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
  }

  const handleServiceDetailsClick = () => {
    openOrderServicePiecesScreen()
  }

  const toOrderModel = (data: Partial<OrderPayload>) => {
    return {
      id: data.id!,
      costumer_id: data.costumer_id,
      employee_id: data.costumer_id,
      status: '1',
    } as Order
  }

  const openOrderDetailsScreen = () => {
    const orderServiceDetailsProps: OrderServiceDetailsProps = {
      onSave(orderServices, screen) {
        screen.close()
        changePayload('services', orderServices)
      },
    }

    if (payload.id) {
      orderServiceDetailsProps.order = toOrderModel(payload)
    }

    if (payload?.services?.length) {
      orderServiceDetailsProps.selectedOrderServices = payload.services
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

  const openOrderPartScreen = () => {
    const orderServiceDetailsProps: OrderPartDetailsProps = {
      onSave(orderServices, screen) {
        screen.close()
        changePayload('services', orderServices)
      },
    }

    if (payload.id) {
      orderServiceDetailsProps.order = toOrderModel(payload)
    }


    if (payload?.services?.length) {
      orderServiceDetailsProps.selectedOrderParts = payload.parts
    }

    openSubScreen<OrderPartDetailsProps>(
      {
        id: 'order-part-details',
        contentSize: '770 430',
        headerTitle: 'Produtos da ordem',
      },
      screen.id,
      orderServiceDetailsProps
    )
  }

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>
      <Body>
        <Box className="flex flex-justify-end">
          <Button
            intent='primary'
            title='Mostrar serviços'
            rightIcon='wrench'
            onClick={openOrderDetailsScreen}
            disabled={isStatusVisualize}
          >
            Serviços
          </Button>
          <Button
            intent='primary'
            title='Mostrar produtos'
            rightIcon='barcode'
            disabled={isStatusVisualize}
            onClick={openOrderPartScreen}
          >
            Produtos
          </Button>
        </Box>
        <Box className="flex align-center flex-wrap">
          <InputText
            label='Número da ordem'
            id={`${screen.id}-order-id`}
            value={payload.reference}
            onChange={(event) => changePayload('reference', event.target.value)}
            disabled={isStatusVisualize}
          />
          <InputText
            label='Referência'
            id={`${screen.id}-reference`}
            value={payload.reference}
            onChange={(event) => changePayload('reference', event.target.value)}
            disabled={isStatusVisualize}
          />
          <InputDate
            label='Data'
            id={`${screen.id}-order-date`}
            value={payload.date}
            onChange={(selectedDate) => changePayload('date', selectedDate)}
            disabled={isStatusVisualize}
          />
          <Select
            onChange={() => {
              console.log('hello')
            }}
            label="Status da ordem"

            items={orderStatusOptions}
          />
          <Select
            handleButtonReloadClick={loadCostumers}
            loading={loadingCostumers}
            intent={Intent.DANGER}
            required
            allowCreate
            activeItem={payload?.costumer_id}
            onChange={(option) =>
              setPayload((prev) => ({
                ...prev,
                costumer_id: option.value as number,
              }))
            }
            defaultButtonText='Escolha um profissional'
            label='Cliente'
            items={costumerOptions.options}
            handleCreateButtonClick={(query) => {
              openSubScreen(
                {
                  id: 'costumer-register',
                  contentSize: '700px 350px',
                },
                screen.id,
                {
                  defaultCostumer: {
                    name: query,
                    personType: PersonType.PHYSICAL,
                  },
                  defaultScreenStatus: ScreenStatus.NEW,
                }
              )
            }}
            buttonProps={
              {
                id: `${screen.id}-select-costumer`,
                style: {
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              } as any
            }
            disabled={screenStatus === ScreenStatus.VISUALIZE}
          />
          <Render renderIf={Boolean(payload?.id)}>
            <Button onClick={handleServiceDetailsClick}>
              Detalhes de serviços
            </Button>
          </Render>
        </Box>
        <Collapse
          title={
            <Row
              style={{
                flex: 1,
                justifyContent: 'space-between',
              }}
            >
              <span> Detalhes da ordem </span>
              <span>R$ 123.45</span>
            </Row>
          }
          isCollapsed={isDetailsCollapsed}
          onChange={() => setIsDetailsCollapsed((prev) => !prev)}
        >
          <Box>
            <Row>
              <InputDate
                label='Validade do orçamento'
                id={`${screen.id}-order-estimated-date`}
                value={payload.estimated_date}
                onChange={(selectedDate) =>
                  changePayload('estimated_date', selectedDate)
                }
                disabled={isStatusVisualize}
              />
              <InputDate
                label='Prazo de execução'
                id={`${screen.id}-order-estimated-date`}
                value={payload.estimated_date}
                onChange={(selectedDate) =>
                  changePayload('estimated_date', selectedDate)
                }
                disabled={isStatusVisualize}
              />
              <InputText id={screen.id + 'vehicle'} label='Marca'/>
              <InputText id={screen.id + 'vehicle'} label='Model'/>
              <InputText id={screen.id + 'vehicle'} label='Placa'/>
              <InputText id={screen.id + 'vehicle'} label='Cor'/>
              <InputText id={screen.id + 'vehicle'} label='Ano'/>
              <InputText id={screen.id + 'vehicle'} label='Combustível'/>
              <InputText id={screen.id + 'vehicle'} label='Quilometragem'/>
              <InputText id={screen.id + 'vehicle'} label='Defeito'/>
            </Row>

            <Row>
              <TextArea
                value={payload?.description || ''}
                onChange={(e) =>
                  setPayload((prev) => ({
                    ...prev,
                    description: e.currentTarget.value,
                  }))
                }
                placeholder='Digite a observação'
                disabled={screenStatus === ScreenStatus.VISUALIZE}
                growVertically={false}
                style={{flex: 1}}
              />
            </Row>
          </Box>
        </Collapse>
        <Collapse
          isCollapsed={isTableCollapsed}
          title='Mostrar ordens cadastradas'
          onChange={() => setIsTableCollapsed((prev) => !prev)}
        >
          <Box>
            <Row>
              <PaginatedTable
                containerProps={{
                  style: {
                    overflowY: 'scroll',
                    width: '100%',
                  },
                }}
                columns={[
                  {
                    id: 1,
                    name: 'Status',
                    keyName: 'status',

                    formatText: (text) =>
                      orderStatus[text as keyof typeof orderStatus],
                  },
                  {
                    id: 1,
                    name: 'Observação',
                    keyName: 'notice',
                  },
                  {
                    id: 1,
                    name: 'Valor',
                    formatText: (text, row) => {
                      return (
                        row?.order_part?.reduce(
                          (acc: any, curr: any) => acc + curr.piece.price,
                          0
                        ) || 'R$ 0'
                      )
                    },
                  },
                  {
                    id: 1,
                    name: 'Criado em',
                    cellRenderer: (cell) => (
                      <Cell>
                        {new Date(cell.created_at).toLocaleDateString('pt-BR')}
                      </Cell>
                    ),
                  },
                ]}
                request={OrderService.getAll as any}
                onRowSelect={(row) => {
                  setScreenStatus(ScreenStatus.VISUALIZE)

                  const formattedRow = {
                    ...row,
                    estimatedTimeType:
                  row?.estimatedTime && row.estimatedTime < 86399
                    ? 'HOURS'
                    : 'DAYS',
                    estimatedTime: addSeconds(
                      new Date('2021-01-01T00:00:00'),
                      row.estimatedTime || 0
                    ),
                    estimatedTimeDay: row.estimatedTime / (3600 * 24),
                    servicesId: row?.services?.map((s: Service) => s.id),
                  }
                  setPayload(formattedRow)
                }}
              />
            </Row>
          </Box>
        </Collapse>
      </Body>
    </Container>
  )
}

export default OrderServiceCostumer
