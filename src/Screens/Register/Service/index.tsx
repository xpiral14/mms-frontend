import React, { useCallback, useMemo, useState } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import 
ServicesService from '../../../Services/ServicesService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import {
  RegistrationButtonBarProps,
  StopLoadFunc,
} from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useGrid } from '../../../Hooks/useGrid'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { Intent } from '@blueprintjs/core'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Service from '../../../Contracts/Models/Service'
import Unit from '../../../Contracts/Models/Unit'
import useAsync from '../../../Hooks/useAsync'
import UnitService from '../../../Services/UnitService'
import Select from '../../../Components/Select'

const ServiceScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Service>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('reference'),
      errorMessage: 'A referência é obrigatória',
      inputId: 'serviceReference',
    },
    {
      check: createValidation('unit_id'),
      errorMessage: 'A unidade é obrigatória',
      inputId: 'serviceUnit',
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'serviceName',
    },
    {
      check: createValidation('price'),
      errorMessage: 'O preço é obrigatório',
      inputId: 'servicePrice',
    },
  ]

  console.log(payload)

  const { validate } = useValidation(validations)
  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()

  const [units, setUnits] = useState<Unit[]>([])

  const unitsOptions = useMemo(
    () =>
      units.map((unit) => ({
        label: unit.name,
        value: unit.id,
      })),
    [units]
  )

  const [loadingUnits, loadUnits] = useAsync(async () => {
    try {
      const response = await UnitService.getAll(1, 100)
      setUnits(response.data.data)
    } catch (error) {
      showErrorToast({
        message: 'Erro ao obter lista de clientes',
      })
    }
  }, [])

  const isStatusVizualize = () =>
    Boolean(screenStatus === ScreenStatus.VISUALIZE)

  const getErrorMessages = (errors?: any[], defaultMessage?: string) => {
    const errorMessages = errors?.map((error: any) => ({
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

  const handleButtonCreateServiceOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const createPayload = {
        description: payload.description,
        name: payload.name,
        price: payload.price,
        reference: payload.reference,
        unit_id: payload.unit_id,
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
      setScreenStatus(ScreenStatus.VISUALIZE)
      setPayload({})
    } catch (error: any) {
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar o serviço'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const handleButtonUpdateServiceOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }

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
        setScreenStatus(ScreenStatus.VISUALIZE)
        setPayload({})
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o serviço',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o serviço'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const handleButtonDeleteServiceOnClick = async () => {
    try {
      const response = await ServicesService.delete(payload.id as number)

      showSuccessToast({
        message: 'Item deletado com sucesso',
        intent: Intent.SUCCESS,
      })

      setPayload({})

      setScreenStatus(ScreenStatus.VISUALIZE)

      if (!response) {
        showErrorToast({
          message: 'Não foi possível deletar o item selecionado',
          intent: Intent.DANGER,
        })
      }
      setReloadGrid(true)
    } catch (error: any) {
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
        id: 5,
        name: 'Código',
        keyName: 'id',
      },
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
                  value={payload?.id || ''}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <Select
                  defaultButtonText='Escolha uma unidade'
                  items={unitsOptions}
                  onChange={(o) => {
                    setPayload((prev) => ({
                      ...prev,
                      unit_id: o.value as number,
                      unit_name: o.label,
                    }))
                  }}
                  activeItem={payload.unit_id}
                  id='serviceUnit'
                  label='Unidade:'
                  disabled={screenStatus === ScreenStatus.VISUALIZE}
                  loading={loadingUnits}
                  handleButtonReloadClick={loadUnits}
                  required
                />
              </div>
            </div>

            <div className='flexRow'>
              <div>
                <InputText
                  id='serviceReference'
                  label='Referência:'
                  required
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  value={payload.reference || ''}
                  placeholder='XXXXXXXX'
                  onChange={createOnChange('reference')}
                  maxLength={90}
                />
              </div>

              <div>
                <InputText
                  id='serviceName'
                  label='Nome:'
                  required
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  inputStyle={{ width: '100%', minWidth: '260px' }}
                  value={payload.name || ''}
                  placeholder='Troca de vela'
                  maxLength={90}
                  onChange={createOnChange('name')}
                />
              </div>
            </div>

            <div className='flexRow'>
              <div style={{ width: '85%' }}>
                <InputText
                  id='serviceDescription'
                  label='Descrição:'
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  inputStyle={{ width: '100%', minWidth: '300ptx' }}
                  value={payload?.description || ''}
                  maxLength={255}
                  onChange={createOnChange('description')}
                />
              </div>

              <div style={{ width: '15%' }}>
                <InputText
                  id='servicePrice'
                  label='Preço:'
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  inputStyle={{ width: '100%', minWidth: '300ptx' }}
                  value={payload?.price || ''}
                  type='number'
                  placeholder='R$'
                  maxLength={50}
                  required
                  onChange={createOnChange('price')}
                />
              </div>
            </div>
          </form>
        </div>

        <div className='tableRow'>
          <PaginatedTable
            onRowSelect={onRowSelect}
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
