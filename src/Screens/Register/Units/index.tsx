import React, { useCallback, useMemo } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import UnitService from '../../../Services/UnitService'
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
import { RenderMode } from '@blueprintjs/table'
import Unit from '../../../Contracts/Models/Unit'

const UnitsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Unit>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'unitName',
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

  const handleButtonCreateUnitOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const response = await UnitService.create(payload as Unit)

      if (response.status) {
        showSuccessToast({
          message: 'Unidade cadastrada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível cadastrar a unidade',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar a unidade'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      setPayload({})
      setScreenStatus(ScreenStatus.VISUALIZE)
      stopLoad()
    }
  }

  const handleButtonUpdateUnitOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      return
    }

    try {
      const response = await UnitService.update(payload as Unit)

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
      setPayload({})
      setScreenStatus(ScreenStatus.VISUALIZE)
      stopLoad()
    }
  }

  const handleButtonDeleteUnitOnClick = async () => {
    try {
      const response = await UnitService.delete(payload.id as number)

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
        'Não foi possível deletar a unidade'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      setScreenStatus(ScreenStatus.VISUALIZE)
    }
  }

  const columns = useMemo(
    () => [
      {
        id: 1,
        name: 'Nome',
        keyName: 'name',
      },
      {
        id: 2,
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

    const referenceInput = document.getElementById('unitName')
    referenceInput?.focus()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateUnitOnClick
        : handleButtonUpdateUnitOnClick,

    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeleteUnitOnClick,
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
              <div style={{ width: '20%' }}>
                <InputText
                  id='unitName'
                  label='Nome:'
                  itent='primary'
                  value={payload?.name || ''}
                  disabled={isStatusVizualize()}
                  style={{ width: '100%' }}
                  onChange={createOnChange('name')}
                  maxLength={6}
                  required
                />
              </div>

              <div style={{ width: '80%' }}>
                <InputText
                  id='unitDescription'
                  label='Descrição:'
                  disabled={isStatusVizualize()}
                  itent='primary'
                  style={{ width: '100%' }}
                  value={payload?.description || ''}
                  onChange={createOnChange('description')}
                  maxLength={120}
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
            request={UnitService.getAll}
            containerProps={containerProps}
            columns={columns}
          />
        </div>
      </Body>
    </Container>
  )
}

export default UnitsScreen
