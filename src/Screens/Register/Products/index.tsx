import React, { useCallback, useEffect, useMemo, useState } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import PaginatedTable from '../../../Components/PaginatedTable'
import ProductsService from '../../../Services/ProductsService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import {
  RegistrationButtonBarProps,
  RegistrationButtons,
  StopLoadFunc,
} from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useGrid } from '../../../Hooks/useGrid'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { DateFormats, ScreenStatus } from '../../../Constants/Enums'
import { Icon, Intent } from '@blueprintjs/core'
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
import { Column } from '../../../Contracts/Components/Table'
import currencyFormat from '../../../Util/currencyFormat'
import strToNumber from '../../../Util/strToNumber'
import useMessageError from '../../../Hooks/useMessageError'
import TextArea from '../../../Components/ScreenComponents/TextArea'
import { useAuth } from '../../../Hooks/useAuth'
import Collapse from '../../../Components/Collapse'
import Box from '../../../Components/Layout/Box'
import InputText from '../../../Components/ScreenComponents/InputText'
import InputNumber from '../../../Components/ScreenComponents/InputNumber'
import FileInput from '../../../Components/ScreenComponents/FileInput'
import Button from '../../../Components/Button'

interface ProductPayload extends Omit<Product, 'price'> {
  price: string
  productImage?: File
  imagePreview?: string
}

const ProductsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const {
    payload,
    setPayload,
    changePayloadAttribute,
    screenStatus,
    setScreenStatus,
  } = useWindow<ProductPayload>()
  const { companySetting } = useAuth()
  const [units, setUnits] = useState<Unit[]>([])

  const unitsOptions = useMemo(
    () =>
      units.map((unit) => ({
        label: unit.description ?? unit.name,
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

  const loadNextProductReference = useCallback(() => {
    ProductsService.getNextReference().then((reference) =>
      changePayloadAttribute('reference', reference)
    )
  }, [])

  const createValidation = (keyName: keyof Product) => () =>
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

  const isStatusVisualize = Boolean(screenStatus === ScreenStatus.VISUALIZE)

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
        price: strToNumber(payload.price ?? 0),
      }

      const {
        data: { data: product },
      } = await ProductsService.create(createPayload as any)

      if (payload.productImage) {
        await ProductsService.uploadImage(product.id!, payload.productImage)
      }

      showSuccessToast({
        message: 'Produto cadastrada com sucesso',
        intent: Intent.SUCCESS,
      })

      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      screen.increaseScreenSize?.()
      setReloadGrid(true)
    } catch (error: any) {
      showErrorMessage(error, 'Não foi possível cadastrar o produto')
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
        {
          ...requestPayload,
          price: strToNumber(requestPayload.price ?? 0),
        }
      )

      if (response.status) {
        showSuccessToast({
          message: 'Produto atualizado com sucesso',
          intent: Intent.SUCCESS,
        })
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        setReloadGrid(true)
        screen.increaseScreenSize?.()
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

  const handleButtonDeleteProductOnClick = async (stopLoad: StopLoadFunc) => {
    try {
      await ProductsService.delete(payload.id as number)

      showSuccessToast({
        message: 'Produto deletado com sucesso',
        intent: Intent.SUCCESS,
      })

      setPayload({})

      setReloadGrid(true)
    } catch (error: any) {
      showErrorMessage(error, 'Não foi possível deletar o produto')
    } finally {
      stopLoad()
    }
  }
  const { showErrorMessage } = useMessageError()

  useEffect(() => {
    return () => {
      if (payload.imagePreview) {
        URL.revokeObjectURL(payload.imagePreview)
      }
    }
  }, [payload.productImage])
  const columns = useMemo(
    () =>
      [
        {
          name: 'Referência',
          keyName: 'reference',
          filters: [{ name: 'Referencia', type: 'text' }],
          sortable: true,
        },
        {
          name: 'Nome',
          keyName: 'name',
          sortable: true,
          filters: [{ name: 'Referencia', type: 'text' }],
          style: {
            width: '40%',
          },
        },
        {
          name: 'Descrição',
          keyName: 'description',
          filters: [{ name: 'Descrição', type: 'text' }],
          formatText: (r) =>
            (r?.description?.length ?? 0) > 80
              ? r?.description?.slice(0, 77) + '...'
              : r?.description,
          style: {
            width: '40%',
          },
        },
        {
          name: 'Preço',
          keyName: 'price',
          sortable: true,
          filters: [{ name: 'Descrição', type: 'text' }],
          formatText: (row) => currencyFormat(row?.price),
        },
        {
          name: 'Data de criação',
          keyName: 'created_at',
          sortable: true,
          filters: [{ name: 'Descrição', type: 'text' }],
          formatText: (row) =>
            new Date(row!.created_at).toLocaleDateString(
              undefined,
              DateFormats.DATE_ONLY
            ),
          style: { minWidth: 190 },
        },
      ] as Column<Product>[],
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

  const focusReferenceInput = () => {
    const referenceInput = document.getElementById('productReference')
    referenceInput?.focus()
  }

  const handleButtonNewOnClick = () => {
    setPayload({ price: '0' })
    loadNextProductReference()
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

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateProductOnClick
        : handleButtonUpdateProductOnClick,
    handleDeleteButtonOnClick: (stopLoad) => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: () => handleButtonDeleteProductOnClick(stopLoad),
        cancelButtonText: 'Cancelar',
      })
    },
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
    handleEditButtonOnClick() {
      setScreenStatus(ScreenStatus.EDIT)
      screen.decreaseScreenSize?.()
    },
    handleButtonImportOnClick: async (e) => {
      const file = e.target.files?.[0]
      if (!file) return
      const formData = new FormData()
      formData.append('file', file)
      try {
        await ProductsService.uploadProducts(formData)
        showSuccessToast('Produto inserido com sucesso')
        setReloadGrid(true)
      } catch (error) {
        showErrorMessage(
          error,
          'Não foi possível fazer o upload do seu arquivo. Verifique se ele está correto e tente novamente'
        )
      } finally {
        e.target.value = ''
      }
    },
    importFileTypes: ['.txt', '.csv'],
    buttonsToShow: [
      ...RegistrationButtonBar.defaultProps!.buttonsToShow!,
      RegistrationButtons.IMPORT,
    ],
  }

  const onRowSelect = useCallback((row: any) => setPayload(row), [])
  const selectedUnit = useMemo(
    () =>
      payload.unit_id ? units.find((u) => u.id === payload.unit_id) : null,
    [payload.unit_id, units]
  )
  return (
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>

      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row column className='gap-3'>
          <Box>
            <Collapse title='Informações gerenciais' controlled={false}>
              <Row>
                <InputText<Product>
                  name='id'
                  id='productId'
                  label='Id:'
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
                <FileInput<ProductPayload>
                  name='productImage'
                  label='Imagem do produto'
                  text={payload.productImage?.name ?? 'Selecionar foto'}
                  buttonText={
                    payload.imagePreview ? 'Trocar foto' : 'Selecionar foto'
                  }
                  accept='image/png'
                  onInputChange={(e) => {
                    if (payload.imagePreview) {
                      URL.revokeObjectURL(payload.imagePreview)
                    }
                    setPayload((prev) => ({
                      ...prev,
                      productImage: e.currentTarget.files?.[0],
                      imagePreview: URL.createObjectURL(
                        e.currentTarget.files![0]
                      ),
                    }))
                  }}
                />
                <Render renderIf={Boolean(payload.imagePreview)}>
                  <a
                    href={payload.imagePreview}
                    target='_blank'
                    rel='noreferrer'
                    className='self-center'
                  >
                    <Icon icon='media' className='mr-2' />
                    Ver imagem
                  </a>
                  <div className='self-center'>
                    <Button
                      icon='trash'
                      help='Excluir foto'
                      intent='danger'
                      onClick={() => {
                        URL.revokeObjectURL(payload.imagePreview!)
                        setPayload((prev) => ({
                          ...prev,
                          imagePreview: undefined,
                          productImage: undefined,
                        }))
                      }}
                    />
                  </div>
                </Render>
              </Row>
              <Row>
                <InputText<Product>
                  name='reference'
                  id='productReference'
                  label='Referência:'
                  disabled={
                    isStatusVisualize ||
                    companySetting.disable_product_reference_edit
                  }
                  intent='primary'
                  style={{ width: '20%' }}
                  inputStyle={{ width: '100%' }}
                  placeholder='XXXXXXXX'
                  required
                  maxLength={90}
                />

                <InputText<Product>
                  name='name'
                  id='productName'
                  label='Nome:'
                  disabled={isStatusVisualize}
                  style={{ flex: 1 }}
                  inputStyle={{ minWidth: '100%' }}
                  placeholder='Digite o nome do produto'
                  maxLength={255}
                />
                <InputNumber<Product>
                  name='price'
                  label='Preço de venda:'
                  disabled={isStatusVisualize}
                  format='currency'
                  min={0}
                  style={{ flex: 1 }}
                  inputStyle={{ width: 'calc(100% - 35px)' }}
                />
                <InputNumber<Product>
                  name='purchase_cost'
                  label='Preço de aquisição:'
                  disabled={isStatusVisualize}
                  format='currency'
                  min={0}
                  defaultValue={0}
                  style={{ flex: 1 }}
                  inputStyle={{ width: 'calc(100% - 35px)' }}
                />
              </Row>

              <Row>
                <TextArea<Product>
                  name='description'
                  id='productDescription'
                  label='Descrição:'
                  disabled={isStatusVisualize}
                  style={{ flex: 8 }}
                  value={payload?.description || ''}
                />
              </Row>
            </Collapse>
          </Box>

          <Box>
            <Collapse title='Informações fiscais' controlled={false}>
              <Row>
                <InputText<Product>
                  name='ncm'
                  help='Nomenclatura Comum do Mercosul'
                  label='NCM'
                  inputStyle={{ width: '100%' }}
                />
                <InputText<Product>
                  name='cest'
                  inputStyle={{ width: '100%' }}
                  help='Código Especificador da Substituição Tributária'
                  label='CEST'
                />
                <InputNumber<Product>
                  name='weight'
                  inputStyle={{ width: 'calc(100% - 36px)' }}
                  format='currency'
                  prefix={
                    selectedUnit?.name ? selectedUnit.name + ' ' : undefined
                  }
                  label='Peso bruto'
                  defaultValue={0}
                />
              </Row>
            </Collapse>
          </Box>
        </Row>
      </Render>

      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='h-full'>
          <PaginatedTable<Product>
            height='100%'
            onRowSelect={onRowSelect}
            request={ProductsService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) => row.id === payload?.id}
            downloadable
            reportRequestOptions={[
              {
                mimeType: 'text/csv',
                reportType: 'csv',
              },
            ]}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default ProductsScreen
