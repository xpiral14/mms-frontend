import { ButtonGroup, Checkbox, Icon, Intent, Tag } from '@blueprintjs/core'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
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
  StopLoadFunc,
} from '../../Contracts/Components/RegistrationButtonBarProps'
import { Option } from '../../Contracts/Components/Suggest'
import { Column } from '../../Contracts/Components/Table'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Product from '../../Contracts/Models/Product'
import ProductStock from '../../Contracts/Models/ProductStock'
import { useAlert } from '../../Hooks/useAlert'
import useAsync from '../../Hooks/useAsync'
import { useGrid } from '../../Hooks/useGrid'
import useMessageError from '../../Hooks/useMessageError'
import { useScreen } from '../../Hooks/useScreen'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import ProductsService from '../../Services/ProductsService'
import ProductStockService from '../../Services/ProductStockService'

import ProductStockScreenProps from '../../Contracts/Screen/ProductStockManagement'
import { ProductStockWarningProps } from '../../Contracts/Screen/ProductStockWarning'
import { Tooltip2 } from '@blueprintjs/popover2'
import SupplierService from '../../Services/SupplierService'
import { ProductStockMovementProps } from '../../Contracts/Screen/ProductStockMovement'
import Bar from '../../Components/Layout/Bar'
const ProductStockManagement: React.FC<ProductStockScreenProps> = ({
  screen,
  stock,
  defaultScreenStatus,
}): JSX.Element => {
  const {
    payload,
    setPayload,
    changePayloadAttribute,
    screenStatus,
    setScreenStatus,
  } = useWindow<
    ProductStock & {
      persisted_quantity?: number
      create_product_stock_movement?: boolean
    }
  >()

  const [supplierOptions, setSupplierOptions] = useState<Option[]>([])
  const [isLoadingSuppliers, loadSuppliers] = useAsync(
    () =>
      SupplierService.getAll(1, 1000).then((r) => {
        setSupplierOptions(
          r.data.data.map((supplier) => ({
            label: supplier.name!,
            value: supplier.id,
          }))
        )
      }),
    []
  )
  useEffect(() => {
    if (defaultScreenStatus) {
      setScreenStatus(defaultScreenStatus)
    }
  }, [defaultScreenStatus])

  const { showErrorToast, showSuccessToast } = useToast()

  const [products, setProducts] = useState<Product[]>([])

  const [loadingProducts, loadProducts] = useAsync(async () => {
    try {
      const productsResponse = await ProductsService.getAll(0, 1000)
      setProducts(productsResponse.data.data)
    } catch (err) {
      showErrorToast({
        message: 'Não foi possível obter a lista de produtos',
      })
    }
  }, [])

  const productOptions: Option[] = useMemo(() => {
    const options = products.map((s) => ({
      label: s.name,
      value: s.id,
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0,
    }
    return options.length ? [firstOption, ...options] : []
  }, [products])

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('product_id'),
      errorMessage: 'O produto é obrigatório',
      inputId: screen.id + 'productIdSelect',
    },
    {
      check: () => {
        const quantity = Number(payload.quantity ?? 0)
        return !isNaN(quantity) && quantity >= 0
      },

      errorMessage: 'Quantidade deve ser um número maior que 0',
      inputId: 'productStockName',
    },
    {
      check: () => {
        if (payload.minimum === undefined) {
          return true
        }

        const minimum = Number(payload.minimum)
        return !isNaN(minimum) && minimum > 0
      },

      errorMessage: 'Quantidade mínima deve ser um número maior que 0',
      inputId: 'productStockName',
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

  const { showErrorMessage } = useMessageError()
  const handleButtonCreateProductStockOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }
    const requestPayload = {
      ...payload,
      quantity: payload.quantity || 0,
      minimum: payload.minimum || 0,
      stock_id: stock.id,
    }
    try {
      const response = await ProductStockService.create(
        requestPayload as ProductStock
      )

      if (response.status) {
        showSuccessToast({
          message: 'Unidade cadastrada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        showErrorMessage(
          response,
          'Não foi possível cadastrar o produto no estoque'
        )
      }
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      setPayload({})
    } catch (error: any) {
      showErrorMessage(error, 'Não foi possível cadastrar o produto no estoque')
    } finally {
      stopLoad()
      increaseWindowSize?.()
    }
  }

  const handleButtonUpdateProductStockOnClick = async (
    stopLoad: StopLoadFunc
  ) => {
    const requestPayload = { ...payload } as any
    decreaseWindowSize?.()

    if (!validate()) {
      stopLoad()
      return
    }

    const deltaQuantity =
      requestPayload.persisted_quantity! - requestPayload.quantity!
    if (requestPayload.id && deltaQuantity != 0) {
      openAlert({
        intent: 'warning',
        icon: 'warning-sign',
        text: (
          <div>
            <p>
              Deseja criar uma movimentação de estoque para essa modificação?
            </p>
            <ul className='p-0'>
              <li>
                <b>Quantidade:</b> {Math.abs(deltaQuantity).toFixed(2)}{' '}
                {requestPayload.unit_name}
              </li>
              <li>
                <b>Tipo de transação: </b>{' '}
                {deltaQuantity < 0 ? 'Incremento' : 'Decremento'}
              </li>
            </ul>
          </div>
        ),
        cancelButtonText: 'Não criar movimentação',
        confirmButtonText: 'Criar movimentação',
        onConfirm: () => {
          requestPayload.create_product_stock_movement = true
          update()
        },
        onCancel: () => {
          update()
        },
      })
      return
    }
    update()
    async function update() {
      try {
        const response = await ProductStockService.update(
          requestPayload as ProductStock
        )

        if (response.status) {
          showSuccessToast({
            message: 'Produto atualizado com sucesso',
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
        setPayload({})
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        stopLoad()
        increaseWindowSize?.()
      }
    }
  }

  const handleButtonDeleteProductStockOnClick = async (
    stopLoad: StopLoadFunc
  ) => {
    try {
      const response = await ProductStockService.delete(
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
      stopLoad()
    }
  }

  const columns = useMemo(
    () =>
      [
        {
          id: 1,
          name: 'Nome',
          keyName: 'product_name',
          filters: [{ name: 'Nome', type: 'text' }],
          style: {
            minWidth: 400
          }
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
          name: 'Reposição automática',
          cellRenderer(_, row) {
            const tooltipMessage = row?.enable_product_restocking
              ? 'Ativo'
              : 'Inativo'
            return (
              <Row className='flex justify-center'>
                <Tooltip2 content={tooltipMessage}>
                  <Tag
                    large
                    fill
                    intent={
                      row?.enable_product_restocking
                        ? Intent.SUCCESS
                        : Intent.NONE
                    }
                  >
                    <Icon
                      icon={row?.enable_product_restocking ? 'tick' : 'cross'}
                    />
                  </Tag>
                </Tooltip2>
              </Row>
            )
          },
        },
        {
          style: {
            width: '30',
          },
          name: 'Status',
          cellRenderer(_, row) {
            const belowStock = row.quantity! < row.minimum!
            const tooltipMessage = belowStock
              ? 'Abaixo do estoque mínimo'
              : row.quantity === row.minimum
                ? 'Igual o estoque mínimo'
                : 'Acima do estoque mínimo'
            return (
              <Row className='flex justify-center'>
                <Tooltip2 content={tooltipMessage} fill>
                  <Tag
                    large
                    fill
                    intent={
                      belowStock
                        ? Intent.DANGER
                        : row.quantity === row.minimum
                          ? Intent.WARNING
                          : Intent.SUCCESS
                    }
                    className='text-center'
                  >
                    <Render renderIf={belowStock}>
                      <Icon icon='minus' />
                    </Render>
                    <Render renderIf={row.quantity === row.minimum}>
                      <Icon icon='equals' />
                    </Render>
                    <Render renderIf={row.quantity > row.minimum}>
                      <Icon icon='plus' />
                    </Render>
                  </Tag>
                </Tooltip2>
              </Row>
            )
          },
          keyName: 'stock_relation',
          filters: [
            {
              name: 'Relação com o estoque mínimo',
              type: 'radio',
              keyName: 'stock_relation',
              value: [
                { label: 'Dentro do estoque mínimo', value: 'inside' },
                { label: 'Abaixo do estoque mínimo', value: 'below' },
              ],
            },
          ],
        },
      ] as Column<ProductStock>[],
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
    const referenceInput = document.getElementById('productStockName')
    referenceInput?.focus()
  }

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)

    increaseWindowSize?.()
  }

  const handleButtonNewOnClick = () => {
    setPayload({
      create_product_stock_movement: false,
    })
    setScreenStatus(ScreenStatus.NEW)
    focusNameInput()
    decreaseWindowSize?.()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateProductStockOnClick
        : handleButtonUpdateProductStockOnClick,

    handleEditButtonOnClick: () => {
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },
    handleDeleteButtonOnClick: (stopLoad: StopLoadFunc) => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: () => handleButtonDeleteProductStockOnClick(stopLoad),
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
    (row: { [key: string]: any }) =>
      setPayload({
        ...row,
        persisted_quantity: row.quantity,
        create_product_stock_movement: false,
      }),
    []
  )

  const handleProductSelect = (option: Option) => {
    changePayloadAttribute('product_id', option.value)
  }

  const { openSubScreen } = useScreen()

  const selectedProduct = useMemo(
    () =>
      payload.product_id
        ? products.find((p) => p.id === payload.product_id)
        : undefined,
    [payload?.product_id, products]
  )
  const customRequest = useCallback(
    (page: number, limit: number) =>
      ProductStockService.getAll(stock.id!, page, limit),
    [stock.id]
  )
  return (
    <Container style={{ height: 'calc(100% - 90px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>
      <Bar className='mt-1 mb-1'>
        <ButtonGroup>
          <Button
            help='Alertas de estoque servem para avisar quando determinado item do estoque está abaixo ou dentro de um certo limite pré-definido'
            icon='warning-sign'
            disabled={!payload.id}
            intent='primary'
            onClick={() => {
              openSubScreen<ProductStockWarningProps>(
                {
                  id: 'product-stock-warning',
                  headerTitle: `Alerta de estoque para "${selectedProduct?.name}"`,
                  contentSize: '420 110',
                },
                screen.id,
                {
                  productStock: payload,
                }
              )
            }}
          >
            Criar alerta de estoque
          </Button>
          <Button
            intent='primary'
            icon='history'
            disabled={!payload.id}
            onClick={() => {
              openSubScreen<ProductStockMovementProps>(
                {
                  id: 'product-stock-movement',
                  headerTitle: `Movimentações do produto ${payload.product?.name} no estoque ${payload.stock?.name}`,
                },
                screen.id,
                {
                  productStock: payload,
                }
              )
            }}
          >
            Ver histórico de movimentações
          </Button>
        </ButtonGroup>
      </Bar>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Box>
          <Row>
            <Select
              required
              buttonProps={
                {
                  className: 'w-full',
                  style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                  },
                } as any
              }
              label='Produto'
              onChange={handleProductSelect}
              id={screen.id + 'productIdSelect'}
              items={productOptions}
              activeItem={payload.product_id}
              loading={loadingProducts}
              handleButtonReloadClick={loadProducts}
            />

            <NumericInput
              id='productStockDescription'
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
              id='productStockDescription'
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
        </Box>
        <Box className='mt-2'>
          <Row className='items-center'>
            <Tooltip2 content='Ativando essa opção o sistema enviará um pedido automático sobre reposição de estoque para o fornecedor selecionado'>
              <Checkbox
                label='Ativar reposição de estoque automática'
                style={{
                  height: 'min-content',
                }}
                checked={payload.enable_product_restocking}
                onChange={() =>
                  changePayloadAttribute(
                    'enable_product_restocking',
                    !payload.enable_product_restocking
                  )
                }
              />
            </Tooltip2>
          </Row>
          <Render renderIf={payload?.enable_product_restocking}>
            <Row>
              <Select
                label='Fornecedor padrão'
                loading={isLoadingSuppliers}
                activeItem={payload.default_supplier_id}
                handleButtonReloadClick={loadSuppliers}
                items={supplierOptions}
                onChange={(supplierOption) =>
                  changePayloadAttribute(
                    'default_supplier_id',
                    supplierOption.value
                  )
                }
              />
              <NumericInput
                id='quantity_type'
                label='Total de produtos para reposição'
                defaultValue={payload?.default_restock_quantity ?? 0}
                onValueChange={(v) => {
                  changePayloadAttribute('default_restock_quantity', v)
                }}
              />
              <NumericInput
                id='quantity_type'
                label='Dias úteis esperados'
                defaultValue={payload?.expected_business_days ?? 0}
                onValueChange={(v) => {
                  changePayloadAttribute('expected_business_days', v)
                }}
              />
            </Row>
          </Render>
        </Box>
      </Render>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='mt-2 h-full'>
          <PaginatedTable<ProductStock>
            height='100%'
            onRowSelect={onRowSelect}
            customRequest={customRequest}
            rowKey={(row) => row.id!}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) => row.id === payload?.id}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default ProductStockManagement
