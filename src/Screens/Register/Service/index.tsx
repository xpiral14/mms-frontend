import React, { useCallback, useMemo, useState } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import ServicesService from '../../../Services/ServicesService'
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
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import NumericInput from '../../../Components/NumericInput'
import { Column } from '../../../Contracts/Components/Table'
import InputNumber from '../../../Components/InputNumber'
import strToNumber from '../../../Util/strToNumber'

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

  const { validate } = useValidation(validations)
  const { setReloadGrid } = useGrid()
  const { showSuccessToast, showErrorToast } = useToast()
  const { openAlert } = useAlert()

  const [units, setUnits] = useState<Unit[]>([])

  const unitsOptions = useMemo(
    () => [
      { label: 'Escolha uma unidade', value: undefined },
      ...units.map((unit) => ({
        label: unit.name,
        value: unit.id,
      })),
    ],
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

  const handleButtonCreateServiceOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const createPayload = {
        description: payload.description,
        name: payload.name,
        price: strToNumber(payload.price ?? 0),
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
      showErrorToast({
        message: error.response.data.data.messages,
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
        showErrorToast({
          message: 'Não foi possível atualizar o serviço',
        })
      }
    } catch (error: any) {
      showErrorToast({
        message: 'Não foi possível atualizar o serviço',
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
      })

      setPayload({})

      setScreenStatus(ScreenStatus.VISUALIZE)

      if (!response) {
        showErrorToast({
          message: 'Não foi possível deletar o item selecionado',
        })
      }

      setReloadGrid(true)

      decreaseWindowSize?.()
    } catch (error: any) {
      showErrorToast({
        message: 'Não foi possível deletar o serviço',
      })
    }
  }

  const columns = useMemo(
    () =>
      [
        {
          name: 'Referencia',
          keyName: 'reference',
          sortable: true,
        },
        {
          name: 'Nome',
          keyName: 'name',
          sortable: true,
          style: {
            width: '100%',
            minWidth: '100%',
          },
        },
        {
          id: 3,
          name: 'Descrição',
          keyName: 'description',
        },
      ] as Column[],
    []
  )

  const focusReferenceInput = () => {
    const referenceInput = document.getElementById('serviceReference')
    referenceInput?.focus()
  }

  const handleButtonNewOnClick = () => {
    setPayload({})
    setScreenStatus(ScreenStatus.NEW)

    focusReferenceInput()
    decreaseWindowSize?.()
  }

  const increaseWindowSize = screen.increaseScreenSize

  const decreaseWindowSize = screen.decreaseScreenSize

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)
    increaseWindowSize?.()
    increaseWindowSize?.()
  }

  const handleCancelButtonOnClick = () => {
    if (screenStatus === ScreenStatus.EDIT) {
      increaseWindowSize?.()
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      return
    }

    setScreenStatus(ScreenStatus.VISUALIZE)
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateServiceOnClick
        : handleButtonUpdateServiceOnClick,
    handleCancelButtonOnClick: handleCancelButtonOnClick,
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
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

  const changePayload = (key: keyof Service, value: any) => {
    setPayload((prev: any) => ({
      ...prev,
      [key]: value || undefined,
    }))
  }

  const onRowSelect = useCallback(
    (row: { [key: string]: any }) => setPayload(row),
    []
  )

  return (
    <Container style={{ height: 'calc(100% - 50px)' }}>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body className='h-full'>
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <div>
            <form>
              <div className='flexRow'>
                <div style={{ width: '10%' }}>
                  <InputText
                    id='serviceId'
                    label='Id:'
                    value={payload?.id || ''}
                    inputStyle={{ width: '100%' }}
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
                <div style={{ flex: 0.85 }}>
                  <InputText
                    id='serviceDescription'
                    label='Descrição:'
                    disabled={isStatusVizualize()}
                    inputStyle={{ width: '100%' }}
                    value={payload?.description || ''}
                    maxLength={255}
                    onChange={createOnChange('description')}
                  />
                </div>

                <div style={{ flex: 0.25 }}>
                  <InputNumber
                    label='Preço:'
                    disabled={isStatusVizualize()}
                    value={payload?.price || ''}
                    placeholder='R$'
                    min={0}
                    format='currency'
                    max={1000000}
                    maxLength={8}
                    defaultValue={0.0}
                    onValueChange={(value) => changePayload('price', value)}
                  />
                </div>
              </div>
            </form>
          </div>
        </Render>

        <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
          <PaginatedTable
            onRowSelect={onRowSelect}
            request={ServicesService.getAll}
            columns={columns}
            height='100%'
            rowKey={(row) => row.id + row.created_at}
            isSelected={(row) => row.id === payload?.id}
          />
        </Render>
      </Body>
    </Container>
  )
}

export default ServiceScreen
