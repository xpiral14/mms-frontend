import React, { useCallback, useMemo } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import StockService from '../../../Services/StockService'
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
import Stock from '../../../Contracts/Models/Stock'
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'
import Button from '../../../Components/Button'
import Box from '../../../Components/Layout/Box'
import { FaProductHunt } from 'react-icons/fa'
import { useScreen } from '../../../Hooks/useScreen'
const StocksScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Stock>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'stockName',
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

  const handleButtonCreateStockOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const response = await StockService.create(payload as Stock)

      if (response.status) {
        showSuccessToast({
          message: 'Estoque cadastrado com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível cadastrar o estoque',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar o estoque'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      stopLoad()
      increaseWindowSize?.()
    }
  }

  const handleButtonUpdateStockOnClick = async (stopLoad: StopLoadFunc) => {
    decreaseWindowSize?.()

    if (!validate()) {
      return
    }

    try {
      const response = await StockService.update(payload as Stock)

      if (response.status) {
        showSuccessToast({
          message: 'Estoque atualizado com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o estoque',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o estoque'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      stopLoad()
      increaseWindowSize?.()
    }
  }

  const handleButtonDeleteStockOnClick = async () => {
    try {
      const response = await StockService.delete(payload.id as number)

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
        'Não foi possível deletar o estoque'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
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
        style: {
          width: '100%',
        },
      },
    ],
    []
  )

  const containerProps = useMemo(
    () => ({
      style: {
        flex: 1,
      },
    }),
    []
  )

  const increaseWindowSize = screen.increaseScreenSize

  const decreaseWindowSize = screen.decreaseScreenSize

  const focusNameInput = () => {
    const referenceInput = document.getElementById('stockName')
    referenceInput?.focus()
  }

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)

    increaseWindowSize?.()
  }

  const handleButtonNewOnClick = () => {
    setPayload({})
    setScreenStatus(ScreenStatus.NEW)
    focusNameInput()
    decreaseWindowSize?.()
  }

  const {openSubScreen} = useScreen()

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateStockOnClick
        : handleButtonUpdateStockOnClick,

    handleEditButtonOnClick: () => {
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },
    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeleteStockOnClick,
        cancelButtonText: 'Cancelar',
      })
    },
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
    handleCancelButtonOnClick: () => {
      if (screenStatus === ScreenStatus.EDIT) {
        increaseWindowSize?.()
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        return
      }

      setScreenStatus(ScreenStatus.VISUALIZE)
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
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Box className='mt-1'>
          <Row className='d-flex justify-content-end'>
            <Button icon={<FaProductHunt size={12} />} disabled={!payload.id} intent={Intent.PRIMARY} onClick={() => {
              openSubScreen({
                id: 'part-stock-management',
                headerTitle: `Gerenciamento de produtos do estoque "${payload.name}"`,
                contentSize: '750px 246px'
              }, screen.id, {
                stock: payload
              })
            }}>
            Gerenciar produtos
            </Button>
          </Row>
        </Box>
        <Box className='mt-2'>
          <Row>
            <InputText
              id='stockName'
              label='Nome:'
              value={payload?.name || ''}
              disabled={isStatusVizualize()}
              onChange={createOnChange('name')}
              maxLength={15}
              required
            />

            <InputText
              id='stockDescription'
              label='Descrição:'
              disabled={isStatusVizualize()}
              style={{ flex: 1 }}
              inputStyle={{ width: '100%' }}
              value={payload?.description || ''}
              onChange={createOnChange('description')}
              maxLength={120}
            />
          </Row>
        </Box>
      </Render>

      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='h-100'>
          <PaginatedTable
            height='100%'
            onRowSelect={onRowSelect}
            request={StockService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) => row.id === payload?.id}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default StocksScreen