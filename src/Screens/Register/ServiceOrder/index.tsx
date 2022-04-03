/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {Collapse, Intent, TextArea,} from '@blueprintjs/core'
import {Cell} from '@blueprintjs/table'
import React, {useEffect, useMemo, useState} from 'react'
import MultiSelect, {MultiSelectOption} from '../../../Components/MultiSelect'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Select from '../../../Components/Select'
import {orderStatus, PersonType, ScreenStatus} from '../../../Constants/Enums'
import {RegistrationButtonBarProps} from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import {Option} from '../../../Contracts/Components/Suggest'
import {Validation} from '../../../Contracts/Hooks/useValidation'
import Costumer from '../../../Contracts/Models/Costumer'
import {OrderPayload} from '../../../Contracts/Models/Order'
import Service from '../../../Contracts/Models/Service'
import {useAlert} from '../../../Hooks/useAlert'
import useAsync from '../../../Hooks/useAsync'
import {useGrid} from '../../../Hooks/useGrid'
import {useScreen} from '../../../Hooks/useScreen'
import {useToast} from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import {useWindow} from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import OrderService from '../../../Services/OrderService'
import ServiceService from '../../../Services/ServiceService'
import {Body, Container, Header} from './style'
import {addSeconds} from 'date-fns'
import Button from '../../../Components/Button'

const orderStatusOptions: MultiSelectOption[] = Object.keys(orderStatus).map(
  (key) => ({
    label: orderStatus[key as keyof typeof orderStatus],
    value: key,
    intent: Intent.SUCCESS,
  })
)

const orderStatusKeyValue: any = {}

orderStatusOptions.forEach((os) => (orderStatusKeyValue[os.value] = os.label))
const OrderServiceCostumer: React.FC<ScreenProps> = ({ screen }) => {
  const [costumers, setCostumer] = useState<Costumer[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isTableCollapsed, setIsTableCollapsed] = useState(true)
  const serviceOptions = useMemo<Option[]>(
    () => services.map((s) => ({ value: s.id, label: s.name })),
    [services]
  )

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

  const [loadingServices, loadServices] = useAsync(async () => {
    try {
      const response = await ServiceService.getAll(1, 100)
      setServices(response.data.data as Service[])
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter lista de clientes',
      })
    }
  }, [])

  const { payload, setPayload, screenStatus, setScreenStatus } = useWindow<{
    id?: number
    services_id: number[]
    costumer_id?: number
    estimated_time_type: 'HOURS' | 'DAYS'
    estimated_time_day: number
    estimated_time: Date
    description: string
  }>()

  useEffect(() => {
    setPayload({
      estimated_time_type: 'HOURS',
      estimated_time: new Date(2021, 7, 29, 1, 0, 0),
    })
  }, [])

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
    },
    {
      check: createValidation('services_id'),
      errorMessage: 'Escolha ao menos um serviço',
      inputId: `${screen.id}-select-services`,
    },
  ]
  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()
  const { openSubScreen } = useScreen()

  const reloadAllScreenData = () => {
    loadCostumers()
    setReloadGrid(true)
    loadServices()
  }

  const openOrderServicePiecesScreen = () => {

  }
  const saveAction = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const requestPayload: OrderPayload = {
        costumerId: payload.costumer_id!,
        servicesId: payload.services_id!,
        description: payload?.description,
      }
      const response = await OrderService.create(requestPayload)
      setReloadGrid(true)
      const openServiceOrderPartsScreen = () => {
      }

      OrderService.addServices(response.data.data.id, payload.services_id!)
      openAlert({
        text: 'Você deseja adicionar os produtos do serviço?',
        intent: Intent.SUCCESS,
        icon: 'add',
        onConfirm: openServiceOrderPartsScreen,
        confirmButtonText: 'Sim',
        canOutsideClickCancel: true,
      })
      setPayload({
        estimated_time_type: 'DAYS',
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

  const updateAction = (stopLoad: () => void) => {
    stopLoad()
  }
  const registratioButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? saveAction : updateAction,
    handleDeleteButtonOnClick: async () => {
      const onConfirm = async () => {
        try {
          await OrderService.delete(payload.id!)
          showSuccessToast({
            message: 'A ordem foi deletada com successo',
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

    if (!payload.services_id?.length) return
    
    openOrderServicePiecesScreen({
      orderId: payload?.id as number,
      services: services.filter((s) => payload.services_id?.includes(s.id)),
    })
  }

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registratioButtonBarProps} />
      </Header>
      <Body>
        <div>
          <Select
            handleButtonReloadClick={loadCostumers}
            loading={loadingCostumers}
            itent={Intent.DANGER}
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
                  headerTitle: 'Criar Clientes',
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
                  width: '250px',
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              } as any
            }
            disabled={screenStatus === ScreenStatus.VISUALIZE}
          />
          <MultiSelect
            id={`${screen.id}-select-services`}
            onChange={(o) => {
              if (payload?.services_id?.includes(o.value as number)) {
                setPayload((prev) => ({
                  ...prev,
                  services_id: prev?.services_id?.filter((s) => s !== o.value),
                }))
              } else {
                setPayload((prev) => ({
                  ...prev,
                  services_id: [...(prev?.services_id || []), o.value as number],
                }))
              }
            }}
            maxWidth={'100%'}
            selectedItems={payload?.services_id}
            items={serviceOptions}
            onClear={() => setPayload((prev) => ({...prev, services_id: []}))}
            onTagRemove={(_, indexOption) => {
              setPayload((prev) => ({
                ...prev,
                services_id: prev.services_id?.filter(
                  (_: any, indexStatus: number) => indexStatus !== indexOption
                ),
              }))
            }}
            label='Selecione os serviços'
            disabled={
              loadingServices || screenStatus === ScreenStatus.VISUALIZE
            }
            formGroupProps={{ style: { flex: 1 } }}
            loading={loadingServices}
            handleButtonReloadClick={loadServices}
          />
          {payload?.id && (
            <Button onClick={handleServiceDetailsClick}>
              Detalhes de serviços
            </Button>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>

          </div>
          <TextArea
            value={payload?.description || ''}
            onChange={(e) =>
              setPayload((prev) => ({ ...prev, description: e.currentTarget.value }))
            }
            placeholder='Digite a observação'
            disabled={screenStatus === ScreenStatus.VISUALIZE}
            growVertically={false}
            style={{ flex: 1 }}
          />
        </div>
        <Button
          text={isTableCollapsed ? 'Colpsar tabela' : 'Descolapsar tabela'}
          onClick={() => setIsTableCollapsed((prev) => !prev)}
        />
        <Collapse isOpen={isTableCollapsed}>
          <PaginatedTable
            containerProps={{
              style: {
                overflowY: 'scrool',
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
        </Collapse>
      </Body>
    </Container>
  )
}

export default OrderServiceCostumer
