import { Intent, Tag } from '@blueprintjs/core'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../Components/Button'
import Box from '../../Components/Layout/Box'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NumericInput from '../../Components/NumericInput'
import PaginatedTable from '../../Components/PaginatedTable'
import RegistrationButtonBar from '../../Components/RegistrationButtonBar'
import Render from '../../Components/Render'
import Select from '../../Components/Select'
import { ScreenStatus } from '../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  StopLoadFunc
} from '../../Contracts/Components/RegistrationButtonBarProps'
import { Option } from '../../Contracts/Components/Suggest'
import { Column } from '../../Contracts/Components/Table'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Part from '../../Contracts/Models/Part'
import PartStock from '../../Contracts/Models/PartStock'
import { useAlert } from '../../Hooks/useAlert'
import useAsync from '../../Hooks/useAsync'
import { useGrid } from '../../Hooks/useGrid'
import useMessageError from '../../Hooks/useMessageError'
import { useScreen } from '../../Hooks/useScreen'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import PartsService from '../../Services/PartsService'
import PartStockService from '../../Services/PartStockService'

import PartStockScreenProps from '../../Contracts/Screen/PartStockManagement'
import { PartStockWarningProps } from '../../Contracts/Screen/PartStockWarning'
const PartStockManagement: React.FC<PartStockScreenProps> = ({
  screen,
  stock,
}): JSX.Element => {
  const {
    payload,
    setPayload,
    changePayloadAttribute,
    screenStatus,
    setScreenStatus,
  } = useWindow<PartStock>()
  const { showErrorToast, showSuccessToast } = useToast()

  const [parts, setParts] = useState<Part[]>([])

  const [loadingParts, loadParts] = useAsync(async () => {
    try {
      const partsResponse = await PartsService.getAll(0, 1000)
      setParts(partsResponse.data.data)
    } catch (err) {
      showErrorToast({
        message: 'Não foi possível obter a lista de produtos',
      })
    }
  }, [])

  const partOptions: Option[] = useMemo(() => {
    const options = parts.map((s) => ({
      label: s.name,
      value: s.id,
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0,
    }
    return options.length ? [firstOption, ...options] : []
  }, [parts])

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('part_id'),
      errorMessage: 'O produto é obrigatório',
      inputId: screen.id + 'partIdSelect',
    },
    {
      check: () => {
        const quantity = Number(payload.quantity)
        return !isNaN(quantity) && quantity > 0
      },
      
      errorMessage: 'Quantidade deve ser um número maior que 0',
      inputId: 'partStockName',
    },
    {
      check: () => {
        if(payload.minimum === undefined){
          return true
        }

        const minimum = Number(payload.minimum)
        return !isNaN(minimum) && minimum > 0
      },
      
      errorMessage: 'Quantidade mínima deve ser um número maior que 0',
      inputId: 'partStockName',
    },
  ]

  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
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

  const {showErrorMessage: showErrormessage} = useMessageError()
  const handleButtonCreatePartStockOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }
    const requestPayload = {
      ...payload,
      stock_id: stock.id
    }
    try {
      const response = await PartStockService.create(requestPayload as PartStock)

      if (response.status) {
        showSuccessToast({
          message: 'Unidade cadastrada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        showErrormessage(response,  'Não foi possível cadastrar o produto no estoque')
      }
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      setPayload({})

    } catch (error: any) {

      showErrormessage(error,   'Não foi possível cadastrar o produto no estoque')
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar o produto no estoque'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
      increaseWindowSize?.()
    }
  }

  const handleButtonUpdatePartStockOnClick = async (stopLoad: StopLoadFunc) => {
    decreaseWindowSize?.()

    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const response = await PartStockService.update(payload as PartStock)

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
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      stopLoad()
      increaseWindowSize?.()
    }
  }

  const handleButtonDeletePartStockOnClick = async () => {
    try {
      const response = await PartStockService.delete(
        stock.id!,
        payload.id as number
      )

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
        'Não foi possível deletar o produto no estoque'
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
          id: 1,
          name: 'Nome',
          keyName: 'part_name',
        },
        {
          id: 2,
          name: 'Quantidade atual',
          keyName: 'quantity',
          formatText(row) {
            return `${(row?.quantity as number)?.toFixed(2)} ${row?.unit_name}`
          },
          style: {
            width: '50%',
          },
        },
        {
          name: 'Quantidade mínima',
          keyName: 'minimum',
          style: {
            width: '30%',
          },
          formatText(row) {
            return `${(row?.minimum as number)?.toFixed(2)} ${row?.unit_name}`
          },
        },
        {
          style: {
            width: '20%',
          },
          name: 'Relação com o estoque mínimo',
          cellRenderer(_, row) {
            const belowStock = row.quantity! < row.minimum!
            return <Tag large fill intent={belowStock ? Intent.DANGER : Intent.SUCCESS}>
              <Render renderIf={belowStock}>
                Abaixo do estoque mínimo
              </Render>
              <Render renderIf={!belowStock}>
                Dentro do estoque mínimo
              </Render>
            </Tag>
          },
        }
      ] as Column[],
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
    const referenceInput = document.getElementById('partStockName')
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

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreatePartStockOnClick
        : handleButtonUpdatePartStockOnClick,

    handleEditButtonOnClick: () => {
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },
    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeletePartStockOnClick,
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

  const onRowSelect = useCallback(
    (row: { [key: string]: any }) => setPayload(row),
    []
  )

  const handlePartSelect = (option: Option) => {
    changePayloadAttribute('part_id', option.value)
  }

  const {openSubScreen} = useScreen()

  const selectedProduct = useMemo(() => payload.part_id ?  parts.find(p => p.id === payload.part_id ) : undefined, [payload?.part_id, parts])
  return (
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>

      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Box className='d-flex justify-content-end'>
          <Button
            help="Alertas de estoque serve para avisar quando determinado item do estoque está abaixo ou dentro de um certo limite pré-definido"
            icon='warning-sign'
            disabled={!payload.id}
            intent={Intent.PRIMARY}
            onClick={() => {
              openSubScreen<PartStockWarningProps>({
                id: 'part-stock-warning',
                headerTitle: `Alerta de estoque para "${selectedProduct?.name}"`,
                contentSize: '420 110'
              }, screen.id, {
                partStock: payload
              })
            }}
          >
            Criar alerta de estoque
          </Button>
        </Box>

        <Row className='mt-2'>
          <Select
            required
            buttonProps={
              {
                className: 'w-100',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                },
              } as any
            }
            label='Produto'
            onChange={handlePartSelect}
            id={screen.id + 'partIdSelect'}
            items={partOptions}
            activeItem={payload.part_id}
            loading={loadingParts}
            handleButtonReloadClick={loadParts}
          />

          <NumericInput
            id='partStockDescription'
            label='Quantidade'
            disabled={isStatusVizualize()}
            stepSize={0.1}
            min={0}
            style={{
              flex: 1,
            }}
            fill
            required
            value={payload?.quantity || 0}
            onValueChange={(_, stringValue) => {
              changePayloadAttribute('quantity', stringValue)
            }}
            maxLength={120}
          />

          <NumericInput
            id='partStockDescription'
            label='Quantidade mínima:'
            disabled={isStatusVizualize()}
            stepSize={0.1}
            min={0}
            fill
            value={payload?.minimum || 0}
            onValueChange={(_, stringValue) => {
              changePayloadAttribute('minimum', stringValue)
            }}
            style={{
              flex: 1,
            }}
            maxLength={120}
          />
        </Row>
      </Render>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='h-100'>
          <PaginatedTable
            height='100%'
            onRowSelect={onRowSelect}
            customRequest={(page, limit) =>
              PartStockService.getAll(stock.id!, page, limit)
            }
            rowKey={(row) => row.id}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) => row.id === payload?.id}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default PartStockManagement
