import React, { useCallback, useMemo } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import PartsService from '../../../Services/PartsService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { RegistrationButtonBarProps, StopLoadFunc } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useGrid } from '../../../Hooks/useGrid'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { Intent } from '@blueprintjs/core'
import { useToast } from '../../../Hooks/useToast'
import Part from '../../../Contracts/Models/Part'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import { RenderMode } from '@blueprintjs/table'

const PartsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Part>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('partReference'),
      errorMessage: 'A referência é obrigatória',
      inputId: 'partReference',
    },
    {
      check: createValidation('partName'),
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

  const handleButtonCreatePartOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate) {
      return
    }

    try {
      const createPayload = {
        ...payload,
        unitId : 201
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
    } finally{
      stopLoad()
    }
  }

  const handleButtonUpdatePartOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate) {
      return
    }
    const requestPayload = {
      ...payload,
      unitId: 201
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
    }finally{
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
  const handleButtonNewOnClick = () => {
    setPayload({})
    setScreenStatus(ScreenStatus.NEW)

    const referenceInput = document.getElementById('partReference')
    referenceInput?.focus()
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
                  id='partId'
                  label='Id:'
                  value={payload?.id || ''}
                  disabled
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <InputText
                  id='partReference'
                  label='Referência:'
                  disabled={isStatusVizualize()}
                  itent='primary'
                  style={{ width: '100%' }}
                  value={payload?.reference || ''}
                  onChange={createOnChange('reference')}
                />
              </div>

              <div style={{ width: '90%' }}>
                <InputText
                  id='partName'
                  label='Nome:'
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  value={payload.name || ''}
                  placeholder='Vela de ignição'
                  onChange={createOnChange('name')}
                />
              </div>
            </div>

            <div className='flexRow'>
              <div style={{ width: '80%' }}>
                <InputText
                  id='partDescription'
                  label='Descrição:'
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  value={payload?.description || ''}
                  onChange={createOnChange('description')}
                />
              </div>

              <div style={{ width: '20%' }}>
                <InputText
                  id='partPrice'
                  label='Preço:'
                  disabled={isStatusVizualize()}
                  placeholder='R$'
                  style={{ width: '100%' }}
                  value={payload?.price || ''}
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
            request={PartsService.getAll}
            containerProps={containerProps}
            columns={columns}
          />
        </div>
      </Body>
    </Container>
  )
}

export default PartsScreen
