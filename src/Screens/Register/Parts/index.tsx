import React, { useCallback, useMemo, useState } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import PartsService from '../../../Services/PartsService'
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
import Part from '../../../Contracts/Models/Part'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import useAsync from '../../../Hooks/useAsync'
import Unit from '../../../Contracts/Models/Unit'
import Select from '../../../Components/Select'
import UnitService from '../../../Services/UnitService'
import Render from '../../../Components/Render'

const PartsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Part>()

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

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('reference'),
      errorMessage: 'A referência é obrigatória',
      inputId: 'partReference',
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'partName',
    },
    {
      check: createValidation('price'),
      errorMessage: 'O preço é obrigatório',
      inputId: 'partPrice',
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

  const handleButtonCreatePartOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const createPayload = {
        ...payload,
      }

      const response = await PartsService.create(createPayload as any)

      if (response.status) {
        showSuccessToast({
          message: 'Peça cadastrada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível cadastrar a peça',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar a peça'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const handleButtonUpdatePartOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      return
    }
    const requestPayload = {
      ...payload,
    }
    try {
      const response = await PartsService.update(
        requestPayload.id as number,
        requestPayload as Part
      )

      if (response.status) {
        showSuccessToast({
          message: 'Peça atualizada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar a peça',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar a peça'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const handleButtonDeletePartOnClick = async () => {
    try {
      const response = await PartsService.delete(payload.id as number)

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
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível deletar a peça'
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

  const focusReferenceInput = () => {
    const referenceInput = document.getElementById('partReference')
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
        ? handleButtonCreatePartOnClick
        : handleButtonUpdatePartOnClick,
    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeletePartOnClick,
        cancelButtonText: 'Cancelar',
      })
    },
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
    handleCancelButtonOnClick: handleCancelButtonOnClick,
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
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <div>
            <form>
              <div className='flexRow'>
                <div style={{ width: '10%' }}>
                  <InputText
                    id='partId'
                    label='Id:'
                    value={payload?.id || ''}
                    disabled
                    style={{ width: '100%' }}
                    inputStyle={{ width: '100%' }}
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
                      }))
                    }}
                    activeItem={payload.unit_id}
                    id='partId'
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
                    id='partReference'
                    label='Referência:'
                    disabled={isStatusVizualize()}
                    itent='primary'
                    style={{ width: '100%' }}
                    value={payload?.reference || ''}
                    onChange={createOnChange('reference')}
                    placeholder='XXXXXXXX'
                    required
                    maxLength={90}
                  />
                </div>

                <div style={{ width: '90%' }}>
                  <InputText
                    id='partName'
                    label='Nome:'
                    disabled={isStatusVizualize()}
                    style={{ width: '100%' }}
                    inputStyle={{ minWidth: '260px' }}
                    value={payload.name || ''}
                    placeholder='Chave de seta'
                    maxLength={90}
                    onChange={createOnChange('name')}
                  />
                </div>
              </div>

              <div className='flexRow'>
                <div style={{ width: '85%' }}>
                  <InputText
                    id='partDescription'
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
                    id='partPrice'
                    label='Preço:'
                    disabled={isStatusVizualize()}
                    placeholder='R$'
                    style={{ width: '100%' }}
                    inputStyle={{ width: '100%', minWidth: '300ptx' }}
                    value={payload?.price || ''}
                    maxLength={50}
                    type='number'
                    onChange={createOnChange('price')}
                  />
                </div>
              </div>
            </form>
          </div>
        </Render>

        <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
          <div className='tableRow'>
            <PaginatedTable
              onRowSelect={onRowSelect}
              request={PartsService.getAll}
              containerProps={containerProps}
              columns={columns}
            />
          </div>
        </Render>
      </Body>
    </Container>
  )
}

export default PartsScreen
