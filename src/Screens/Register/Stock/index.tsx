import { Intent } from '@blueprintjs/core'
import React, { useCallback, useMemo } from 'react'
import { FaProductHunt } from 'react-icons/fa'
import Button from '../../../Components/Button'
import InputText from '../../../Components/InputText'
import Box from '../../../Components/Layout/Box'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Render from '../../../Components/Render'
import { ScreenStatus } from '../../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  StopLoadFunc
} from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Stock from '../../../Contracts/Models/Stock'
import { ProductStockProps } from '../../../Contracts/Screen/ProductStockManagement'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import { useScreen } from '../../../Hooks/useScreen'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import StockService from '../../../Services/StockService'
import { Column } from '../../../Contracts/Components/Table'
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
    () =>
      [
        {
          name: 'Nome',
          keyName: 'name',
          filters: [
            {
              name: 'Nome do estoque',
              type: 'text',
            },
          ],
        },
        {
          name: 'Descrição',
          keyName: 'description',
          style: {
            width: '75%',
          },
          filters: [
            {
              name: 'Descrição',
              type: 'text',
            },
          ],
        },
      ] as Column<Stock>[],
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

  const { openSubScreen } = useScreen()

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
      increaseWindowSize?.()
      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
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
    <Container style={{ height: 'calc(100% - 85px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
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
        <Box className='mt-1'>
          <Row className='d-flex justify-content-end'>
            <Button
              icon={<FaProductHunt size={12} />}
              disabled={!payload.id}
              intent={Intent.PRIMARY}
              onClick={() => {
                openSubScreen<ProductStockProps>(
                  {
                    id: 'product-stock-management',
                    headerTitle: `Gerenciamento de produtos do estoque "${payload.name}"`,
                    contentSize: '750px 246px',
                  },
                  screen.id,
                  {
                    stock: payload,
                    defaultScreenStatus: ScreenStatus.SEE_REGISTERS,
                  }
                )
              }}
            >
              Gerenciar produtos
            </Button>
          </Row>
        </Box>
        <Row className='h-100'>
          <PaginatedTable<Stock>
            height='100%'
            onRowSelect={onRowSelect}
            customRequest={StockService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) => row.id === payload?.id}
            downloadable
            reportRequestOptions={[
              {
                mimeType: 'text/csv',
                reportType: 'csv',
                responseType: 'text',
                name: 'Estoques cadastrados'
              },
            ]}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default StocksScreen
