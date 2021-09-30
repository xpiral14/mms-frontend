/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormGroup, Intent, NumericInput, TextArea } from '@blueprintjs/core'
import { TimePicker } from '@blueprintjs/datetime'
import { Cell } from '@blueprintjs/table'
import React, { useMemo, useState } from 'react'
import { useEffect } from 'react'
import InputText from '../../../Components/InputText'
import MultiSelect, { MultiSelectOption } from '../../../Components/MultiSelect'
import PaginatedTable from '../../../Components/PaginatedTable'
import RadioGroup from '../../../Components/RadioGroup'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Select from '../../../Components/Select'
import { orderStatus, PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { Option } from '../../../Contracts/Components/Suggest'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Costumer from '../../../Contracts/Models/Costumer'
import Order, { OrderPayload } from '../../../Contracts/Models/Order'
import Service from '../../../Contracts/Models/Service'
import { useAlert } from '../../../Hooks/useAlert'
import useAsync from '../../../Hooks/useAsync'
import { useGrid } from '../../../Hooks/useGrid'
import { useScreen } from '../../../Hooks/useScreen'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import OrderService from '../../../Services/OrderService'
import ServiceService from '../../../Services/ServiceService'
import getSecondsFromDay from '../../../Util/getSecondsFromDay'
import getTimeInSecondsFromDate from '../../../Util/getTimeInSecondsFromDate'
import { Body, Container, Header } from './style'
import { addSeconds } from 'date-fns'
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
    servicesId: number[]
    costumerId?: number
    estimatedTimeType: 'HOURS' | 'DAYS'
    estimatedTimeDay: number
    estimatedTime: Date
    notice: string
  }>()

  useEffect(() => {
    setPayload({
      estimatedTimeType: 'HOURS',
      estimatedTime: new Date(2021, 7, 29, 1, 0, 0),
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
      check: createValidation('costumerId'),
      errorMessage: 'Escolha o cliente',
      inputId: `${screen.id}-select-costumer`,
    },
    {
      check: createValidation('servicesId'),
      errorMessage: 'Escolha ao menos um serviço',
      inputId: `${screen.id}-select-services`,
    },
    {
      check:
        payload.estimatedTimeType === 'HOURS'
          ? createValidation('estimatedTimeType')
          : createValidation('estimatedTimeDay'),
      errorMessage: 'Escolha um tempo estimado para a ordem',
      inputId: `${screen.id}-select-services`,
    },
  ]
  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()
  const { openSubScreen } = useScreen()
  // const isStatusVizualize = () => screenStatus === ScreenStatus.VISUALIZE

  const getErrorMessages = (errors?: any[], defaultMessage?: string) => {
    const errorMessages = errors?.map((error) => ({
      message: error.message,
    })) || [{ message: defaultMessage }]

    return (
      <ul>
        {errorMessages?.map(({ message }) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    )
  }

  const reloadAllScreenData = () => {
    loadCostumers()
    setReloadGrid(true)
    loadServices()
  }

  const openOrderServicePiecesScreen = (props: {
    orderId: number
    services: Service[]
  }) => {
    openSubScreen(
      {
        headerTitle: 'Cadastro de peça nos serviços escolhidos',
        id: 'save-order-service-parts',
        path: 'Register/ServiceOrder/subScreens/ServiceOrderParts',
        contentSize: '400 330'
      },
      screen.id,
      props
    )
  }
  const saveAction = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const requestPayload: OrderPayload = {
        costumerId: payload.costumerId!,
        servicesId: payload.servicesId!,
        estimatedTime:
          payload.estimatedTimeType === 'DAYS'
            ? getSecondsFromDay(payload.estimatedTimeDay!)
            : getTimeInSecondsFromDate(payload.estimatedTime!),
        notice: payload?.notice,
      }
      const response = await OrderService.create(requestPayload)
      setReloadGrid(true)
      const openServiceOrderPartsScreen = () => {
        openOrderServicePiecesScreen({
          orderId: response.data.id,
          services: services.filter((s) => payload.servicesId?.includes(s.id)),
        })
      }

      openAlert({
        text: 'Você deseja adicionar os produtos do serviço?',
        intent: Intent.SUCCESS,
        icon: 'add',
        onConfirm: openServiceOrderPartsScreen,
        confirmButtonText: 'Sim',
        canOutsideClickCancel: true,
      })
      setPayload({
        estimatedTimeType: 'DAYS',
      })
    } catch (error) {
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
        text: 'Você tem certeza que deseja deletar a ordemd e serviço?',
        onConfirm,
        intent: Intent.DANGER,
      })
    },
    handleReloadScreenOnClick: reloadAllScreenData,
  }

  const handleServiceDetailsClick = () => {
    openOrderServicePiecesScreen({
      orderId: payload?.id as number,
      services: services.filter((s) => payload.servicesId?.includes(s.id)),
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
            inputProps={{
              id: `${screen.id}-select-costumer`,
            }}
            handleButtonReloadClick={loadCostumers}
            loading={loadingCostumers}
            itent={Intent.DANGER}
            required
            allowCreate
            activeItem={payload?.costumerId}
            onChange={(option) =>
              setPayload((prev) => ({
                ...prev,
                costumerId: option.value as number,
              }))
            }
            defaultButtonText='Escolha um profissional'
            label='Cliente'
            items={costumerOptions.options}
            handleCreateButtonClick={(query) => {
              openSubScreen(
                {
                  id: 'register-costumer',
                  contentSize: '700px 350px',
                  headerTitle: 'Clientes',
                  path: 'Register/Costumer',
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
            id={`${screen.id}_select_sevices`}
            onChange={(o) => {
              if (payload?.servicesId?.includes(o.value as number)) {
                setPayload((prev) => ({
                  ...prev,
                  servicesId: prev?.servicesId?.filter((s) => s !== o.value),
                }))
              } else {
                setPayload((prev) => ({
                  ...prev,
                  servicesId: [...(prev?.servicesId || []), o.value as number],
                }))
              }
            }}
            maxWidth={'100%'}
            selectedItems={payload?.servicesId}
            items={serviceOptions}
            onClear={() => setPayload((prev) => ({ ...prev, servicesId: [] }))}
            onTagRemove={(_, indexOption) => {
              setPayload((prev) => ({
                ...prev,
                servicesId: prev.servicesId?.filter(
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
            <RadioGroup
              disabled={screenStatus === ScreenStatus.VISUALIZE}
              label='Duração mínima'
              selectedValue={payload.estimatedTimeType}
              radios={[
                { id: 'HOURS', value: 'HOURS', label: 'Horas' },
                { id: 'DAYS', value: 'DAYS', label: 'Dias' },
              ]}
              onChange={(e) => {
                setPayload((prev) => ({
                  ...prev,
                  estimatedTimeType: e.currentTarget.value as any,
                  estimatedTime: new Date(2021, 7, 29, 1, 0, 0),
                  estimatedTimeDay: 1,
                }))
              }}
            />
            {payload?.estimatedTimeType === 'DAYS' ? (
              <NumericInput
                disabled={screenStatus === ScreenStatus.VISUALIZE}
                allowNumericCharactersOnly
                value={payload?.estimatedTimeDay}
                onValueChange={(value) => {
                  setPayload((prev) => ({
                    ...prev,
                    estimatedTimeDay: value > 365 ? 365 : value,
                  }))
                }}
                max={365}
              />
            ) : (
              <TimePicker
                disabled={screenStatus === ScreenStatus.VISUALIZE}
                value={payload.estimatedTime}
                onChange={(time) =>
                  setPayload((prev) => ({ ...prev, estimatedTime: time }))
                }
              />
            )}
          </div>
          <TextArea
            value={payload?.notice || ''}
            onChange={(e) =>
              setPayload((prev) => ({ ...prev, notice: e.currentTarget.value }))
            }
            placeholder='Digite a observação'
            disabled={screenStatus === ScreenStatus.VISUALIZE}
            growVertically={false}
            style={{ flex: 1 }}
          />
        </div>
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
                  row?.orderPiece?.reduce(
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
      </Body>
    </Container>
  )
}

export default OrderServiceCostumer
