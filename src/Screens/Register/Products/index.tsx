import React, { useCallback, useMemo, useState } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import ProductsService from '../../../Services/ProductsService'
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
import Product from '../../../Contracts/Models/Product'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import useAsync from '../../../Hooks/useAsync'
import Unit from '../../../Contracts/Models/Unit'
import Select from '../../../Components/Select'
import UnitService from '../../../Services/UnitService'
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'

const ProductsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Product>()

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
      inputId: 'productReference',
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'productName',
    },
    {
      check: createValidation('price'),
      errorMessage: 'O preço é obrigatório',
      inputId: 'productPrice',
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

  const handleButtonCreateProductOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const createPayload = {
        ...payload,
      }

      const response = await ProductsService.create(createPayload as any)

      if (response.status) {
        showSuccessToast({
          message: 'Produto cadastrada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível cadastrar o produto',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const errorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível cadastrar o produto'
      )

      openAlert({
        text: errorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const handleButtonUpdateProductOnClick = async (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      return
    }
    const requestPayload = {
      ...payload,
    }
    try {
      const response = await ProductsService.update(
        requestPayload.id as number,
        requestPayload as Product
      )

      if (response.status) {
        showSuccessToast({
          message: 'Produto atualizada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o produto',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o produto'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const handleButtonDeleteProductOnClick = async () => {
    try {
      const response = await ProductsService.delete(payload.id as number)

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
        'Não foi possível deletar o produto'
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
        style: {
          width: '40%',
        },
      },
      {
        id: 3,
        name: 'Descrição',
        keyName: 'description',
        style: {
          width: '40%',
        },
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
        flex: 1
      }
    }),
    []
  )

  const focusReferenceInput = () => {
    const referenceInput = document.getElementById('productReference')
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
        ? handleButtonCreateProductOnClick
        : handleButtonUpdateProductOnClick,
    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeleteProductOnClick,
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
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>

      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
         
        <Row>
          <InputText
            id='productId'
            label='Id:'
            value={payload?.id || ''}
            disabled
            style={{ width: '10%' }}
            inputStyle={{ width: '100%' }}
          />
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
            id='productId'
            label='Unidade:'
            disabled={screenStatus === ScreenStatus.VISUALIZE}
            loading={loadingUnits}
            handleButtonReloadClick={loadUnits}
          />
        </Row>
        <Row>
          <InputText
            id='productReference'
            label='Referência:'
            disabled={isStatusVizualize()}
            itent='primary'
            style={{ width: '20%' }}
            inputStyle={{ width: '100%' }}
            value={payload?.reference || ''}
            onChange={createOnChange('reference')}
            placeholder='XXXXXXXX'
            required
            maxLength={90}
          />

          <InputText
            id='productName'
            label='Nome:'
            disabled={isStatusVizualize()}
            inputStyle={{ minWidth: '260px' }}
            value={payload.name || ''}
            placeholder='Chave de seta'
            maxLength={90}
            onChange={createOnChange('name')}
          />
        </Row>

        <Row>
          <InputText
            id='productDescription'
            label='Descrição:'
            disabled={isStatusVizualize()}
            style={{flex: 8 }}
            inputStyle={{ width: '100%', minWidth: '300ptx' }}
            value={payload?.description || ''}
            maxLength={255}
            onChange={createOnChange('description')}
          />

          <InputText
            id='productPrice'
            label='Preço:'
            disabled={isStatusVizualize()}
            placeholder='R$'
            style={{ flex: 2 }}
            inputStyle={{ width: '100%' }}
            value={payload?.price || ''}
            maxLength={50}
            type='number'
            onChange={createOnChange('price')}
          />
        </Row>
      </Render>

      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='h-100'>
          <PaginatedTable
            height='100%'
            onRowSelect={onRowSelect}
            request={ProductsService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={row => row.id === payload?.id}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default ProductsScreen
