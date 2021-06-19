/* eslint-disable @typescript-eslint/no-empty-function */
import { Intent } from '@blueprintjs/core'
import Select from '../../../Components/Select'
import { Cell } from '@blueprintjs/table'
import React, { useMemo, useState } from 'react'
import InputText from '../../../Components/InputText'
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
import { Option } from '../../../Contracts/Components/Select'
import useAsync from '../../../Hooks/useAsync'
import { useScreen } from '../../../Hooks/useScreen'

const orderStatusOptions: Option[] = Object.keys(orderStatus).map((key) => ({
  label: orderStatus[key as keyof typeof orderStatus],
  value: key,
}))

const OrderServiceCostumer: React.FC<ScreenProps> = ({ screen }) => {
  const [costumers, setCostumer] = useState<Costumer[]>([])
  const clienteOptions: Option[] = useMemo(
    () =>
      costumers.map((costumer) => ({
        label: costumer.name,
        value: costumer.id,
      })),
    [costumers]
  )

  const { showErrorToast } = useToast()
  const [, loadCostumers] = useAsync(async () => {
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
    useWindow<Costumer>()

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
  }
  const registratioButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? createCostumer : saveCostumer,
    handleDeleteButtonOnClick: deleteCostumer,
    handleReloadScreenOnClick: reloadAllScreenData,
  }

  const createOnChange =
    (attributeName: string) => (evt: React.FormEvent<HTMLInputElement>) => {
      setPayload((prev: any) => ({
        ...prev,
        [attributeName]: evt.currentTarget.value,
      }))
    }

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registratioButtonBarProps} />
      </Header>
      <Body>
        <div></div>
        <div>
          <Select
            allowCreate
            onChange={(option) =>
              setPayload((prev) => ({ ...prev, costumerId: option.value }))
            }
            label='Cliente'
            items={clienteOptions}
            handleCreateButtonClick={() => {
              openSubScreen(
                {
                  id: 'register-costumer',
                  path: 'Register/Costumer',
                },
                screen.id
              )
            }}
          />
          <InputText
            value={payload?.name || ''}
            id='name'
            label='Nome do cliente'
            placeholder='Digite o nome do cliente'
            disabled={isStatusVizualize()}
            onChange={createOnChange('name')}
            required
          />

          <InputText
            value={payload?.email || ''}
            id='Email'
            label='Email do cliente'
            placeholder='Digite o email do cliente'
            disabled={isStatusVizualize()}
            onChange={createOnChange('email')}
          />
          <InputText
            value={payload?.phone || ''}
            id='phone'
            mask='(99) 99999-9999'
            label='Telefone'
            placeholder='Digite o Telefone do cliente'
            disabled={isStatusVizualize()}
            onChange={createOnChange('phone')}
          />
          <Select
            onChange={(option) =>
              setPayload((prev) => ({ ...prev, status: option.value }))
            }
            label='Status'
            items={orderStatusOptions}
            allowCreate
          />
        </div>
        <PaginatedTable
          containerProps={{
            style: {
              height: '300px',
              maxHeight: '100px',
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
