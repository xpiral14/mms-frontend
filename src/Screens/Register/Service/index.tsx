import React, { useCallback, useMemo } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import ServicesService from '../../../Services/ServicesService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useGrid } from '../../../Hooks/useGrid'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { Intent } from '@blueprintjs/core'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import { RenderMode } from '@blueprintjs/table'
import Service from '../../../Contracts/Models/Service'

const ServiceScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Service>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('partReference'),
      errorMessage: 'A referência é obrigatória',
      inputId: 'serviceReference',
    },
    {
      check: createValidation('partName'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'serviceName',
    },
    {
      check: createValidation('price'),
      errorMessage: 'O preço é obrigatório',
      inputId: 'servicePrice',
    },
  ]
  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showErrorToast, showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const isStatusVizualize = () =>
    Boolean(screenStatus === ScreenStatus.VISUALIZE)

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

  const handleButtonCreateServiceOnClick = async () => {
    if (!validate) {
      return
    }

    try {
      const createPayload = {
        ...payload,
      }

      const response = await ServicesService.create(createPayload as any)

      if (response.status) {
        showSuccessToast({
          message: 'Serviço cadastrado com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível cadastrar o serviço',
          intent: Intent.DANGER,
        })
      }
    } catch (error) {
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar o serviço'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const handleButtonUpdateServiceOnClick = async () => {
    if (!validate) {
      return
    }

    const updatePayload = payload
    delete updatePayload.id

    try {
      const response = await ServicesService.update(
        payload.id as number,
        payload as Service
      )

      if (response.status) {
        showSuccessToast({
          message: 'Serviço atualizado com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o serviço',
          intent: Intent.DANGER,
        })
      }
    } catch (error) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o serviço'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const handleButtonDeleteServiceOnClick = async () => {
    try {
      const response = await ServicesService.delete(payload.id as number)

      if (response.status) {
        showSuccessToast({
          message: 'Item deletado com sucesso',
          intent: Intent.SUCCESS,
        })

        setPayload({})

        setReloadGrid(true)
      }

      if (!response) {
        showErrorToast({
          message: 'Não foi possível deletar o item selecionado',
          intent: Intent.DANGER,
        })
      }
    } catch (error) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível deletar o serviço'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 1,
        name: 'Referencia',
        keyName: 'reference',
      },
      {
        id: 2,
        name: 'Nome',
        keyName: 'name',
      },
      {
        id: 3,
        name: 'Descrição',
        keyName: 'description',
      },
      {
        id: 4,
        name: 'Preço',
        keyName: 'price',
      },
    ],
    []
  )

  const containerProps = useMemo(
    () => ({
      style: {
        height: '100%',
      },
    }),
    []
  )

  const handleButtonNewOnClick = () => {
    setPayload({})
    setScreenStatus(ScreenStatus.NEW)

    const referenceInput = document.getElementById('serviceReference')
    referenceInput?.focus()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateServiceOnClick
        : handleButtonUpdateServiceOnClick,
    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeleteServiceOnClick,
        cancelButtonText: 'Cancelar',
      })
    },
  }

  const createOnChange =
    (attributeName: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      setPayload((prev: any) => ({
        ...prev,
        [attributeName]: evt.target.value || undefined,
      }))
    }

  const onRowSelect = useCallback(
    (row: { [key: string]: any }) => setPayload(row),
    []
  )

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body>
        <div>
          <form>
            <div className='flexRow'>
              <div style={{ width: '10%' }}>
                <InputText
                  id='serviceId'
                  label='Id:'
                  value={payload?.id}
                  readOnly
                  disabled={!payload}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <InputText
                  id='serviceReference'
                  label='Referência:'
                  readOnly={isStatusVizualize()}
                  itent='primary'
                  style={{ width: '100%' }}
                  value={payload?.reference}
                  onChange={createOnChange('reference')}
                />
              </div>

              <div style={{ width: '90%' }}>
                <InputText
                  id='serviceName'
                  label='Nome:'
                  readOnly={isStatusVizualize()}
                  itent='primary'
                  style={{ width: '100%' }}
                  value={payload.name}
                  placeholder='Vela de ignição'
                  onChange={createOnChange('name')}
                />
              </div>
            </div>

            <div className='flexRow'>
              <div style={{ width: '80%' }}>
                <InputText
                  id='serviceDescription'
                  label='Descrição:'
                  readOnly={isStatusVizualize()}
                  itent='primary'
                  style={{ width: '100%' }}
                  value={payload?.description}
                  onChange={createOnChange('description')}
                />
              </div>

              <div style={{ width: '20%' }}>
                <InputText
                  id='servicePrice'
                  label='Preço:'
                  readOnly={isStatusVizualize()}
                  placeholder='R$'
                  itent='primary'
                  style={{ width: '100%' }}
                  value={payload?.price}
                  onChange={createOnChange('price')}
                />
              </div>
            </div>
          </form>
        </div>

        <div className='tableRow'>
          <PaginatedTable
            onRowSelect={onRowSelect}
            enableGhostCells
            renderMode={RenderMode.BATCH_ON_UPDATE}
            request={ServicesService.getAll}
            containerProps={containerProps}
            columns={columns}
          />
        </div>
      </Body>
    </Container>
  )
}

export default ServiceScreen
