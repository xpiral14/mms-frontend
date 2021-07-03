import { Intent } from '@blueprintjs/core'
import Select from '../../../Components/Select'
import { Cell } from '@blueprintjs/table'
import React, { useMemo, useState } from 'react'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import { orderStatus, PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Costumer from '../../../Contracts/Models/Costumer'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import OrderService from '../../../Services/OrderService'
import { Container, Header, Body } from './style'
import { Option } from '../../../Contracts/Components/Suggest'
import useAsync from '../../../Hooks/useAsync'
import { useScreen } from '../../../Hooks/useScreen'

const orderStatusOptions: Option[] = Object.keys(orderStatus).map((key) => ({
  label: orderStatus[key as keyof typeof orderStatus],
  value: key,
}))

const orderStatusKeyValue: any = {}

orderStatusOptions.forEach((os) => (orderStatusKeyValue[os.value] = os.label))
const OrderServiceCostumer: React.FC<ScreenProps> = ({ screen }) => {
  const [costumers, setCostumer] = useState<Costumer[]>([])
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

  const { showErrorToast } = useToast()
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
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<any>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('personType'),
      errorMessage: 'O tipo de pessoa é obrigatório',
      inputId: PersonType.PHYSICAL,
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'name',
    },
    {
      check: createValidation('phone'),
      errorMessage: 'O telefone é obrigatório',
      inputId: 'phone',
    },
  ]
  const { validate } = useValidation(validations)
  const { setReloadGrid } = useGrid()
  const { showSuccessToast } = useToast()
  const { openAlert } = useAlert()
  const { openSubScreen } = useScreen()
  const isStatusVizualize = () => screenStatus === ScreenStatus.VISUALIZE

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

  const createCostumer = async () => {
    if (!validate()) {
      return
    }
    try {
      const createPayload = {
        ...payload,
        phone: payload.phone?.replace(/[^0-9]/g, ''),
      }
      const response = await CostumerService.create(createPayload)
      if (response.status) {
        showSuccessToast({
          message: 'Cliente criado com sucesso',
          intent: Intent.SUCCESS,
        })
        setReloadGrid(true)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível criar o cliente',
          intent: Intent.DANGER,
        })
      }
    } catch (error) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível criar o cliente'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const saveCostumer = async () => {
    try {
      const response = await CostumerService.edit(payload)
      if (response.status) {
        showSuccessToast({
          message: 'Cliente atualizado com sucesso',
          intent: Intent.SUCCESS,
        })
        setPayload({})
        setReloadGrid(true)
        setScreenStatus(ScreenStatus.VISUALIZE)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o cliente',
          intent: Intent.DANGER,
        })
      }
    } catch (error) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o cliente'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const deleteCostumer = () => {
    const onConfirm = async () => {
      try {
        const response = await CostumerService.delete(payload?.id as number)
        if (response.status) {
          showSuccessToast({
            message: 'Cliente criado com sucesso',
            intent: Intent.SUCCESS,
          })
          setReloadGrid(true)
          setScreenStatus(ScreenStatus.VISUALIZE)
          setPayload({})
        }
        if (!response) {
          openAlert({
            text: 'Não foi possível criar o cliente',
            intent: Intent.DANGER,
          })
        }
      } catch (error) {
        const ErrorMessages = getErrorMessages(
          error.response?.data?.errors,
          'Não foi possível criar o cliente'
        )

        openAlert({
          text: ErrorMessages,
          intent: Intent.DANGER,
        })
      }
    }
    openAlert({
      text: 'Tem certeza que deseja deletar o cliente?',
      intent: Intent.DANGER,
      confirmButtonText: `Deletar cliente ${payload?.name || ''}`,
      onConfirm,
    })
  }
  const reloadAllScreenData = () => {
    loadCostumers()
    setReloadGrid(true)
  }
  const registratioButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? createCostumer : saveCostumer,
    handleDeleteButtonOnClick: deleteCostumer,
    handleReloadScreenOnClick: reloadAllScreenData,
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
            activeItem={costumerOptions.keyValue[payload.costumerId]}
            onChange={(option) =>
              setPayload((prev) => ({ ...prev, costumerId: option.value }))
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
          <Select
            onChange={(option) =>
              setPayload((prev) => ({ ...prev, status: option.value }))
            }
            label='Status'
            activeItem={payload.statusId}
            items={orderStatusOptions}
            disabled={isStatusVizualize()}
            allowCreate
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
              cellRenderer: (cell) => (
                <Cell>
                  {orderStatus[cell.status as keyof typeof orderStatus]}
                </Cell>
              ),
            },
            {
              id: 1,
              name: 'Observação',
              keyName: 'notice',
            },
            {
              id: 1,
              name: 'Valor',
              cellRenderer: (cell) => (
                <Cell>
                  {cell.orderPiece?.reduce(
                    (acc: any, curr: any) => acc + curr.piece.price,
                    0
                  ) || 0}
                </Cell>
              ),
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
            setPayload(row)
          }}
        />
      </Body>
    </Container>
  )
}

export default OrderServiceCostumer
