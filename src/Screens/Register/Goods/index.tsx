import React, { useMemo, useState, useCallback } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import GoodService from '../../../Services/GoodService'
import { StopLoadFunc } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { ButtonGroup, Intent } from '@blueprintjs/core'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Good, {
  GoodStatuses,
  GoodStatusesNames,
} from '../../../Contracts/Models/Good'
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'
import { GoodRegisterScreenProps } from '../../../Contracts/Screen/Register/Goods'
import { Column, Row as TableRow } from '../../../Contracts/Components/Table'
import InputDate from '../../../Components/InputDate'
import Table from '../../../Components/Table'
import GoodProduct from '../../../Contracts/Models/GoodProduct'
import Button from '../../../Components/Button'
import Bar from '../../../Components/Layout/Bar'
import { useScreen } from '../../../Hooks/useScreen'
import { AddProductToGoodProps } from '../../../Contracts/Screen/AddProductToGood'
import currencyFormat from '../../../Util/currencyFormat'
import useMessageError from '../../../Hooks/useMessageError'
// import { DistributeGoodsProps } from '../../../Contracts/Screen/DistributeGoods'
import Box from '../../../Components/Layout/Box'
import { DistributeGoodsProps } from '../../../Contracts/Screen/DistributeGoods'
import { FilterType, ReportRequestOption } from '../../../Contracts/Types/Api'

const GoodsScreen: React.FC<GoodRegisterScreenProps> = ({
  screen,
  supplierId,
}): JSX.Element => {
  const {
    screenStatus,
    setScreenStatus,
    payload,
    setPayload,
    changePayloadAttribute,
  } = useWindow<Good>()
  const { openSubScreen } = useScreen()
  const [selectedGoodProduct, setSelectedProduct] =
    useState<GoodProduct | null>(null)
  const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(false)
  const validations = [
    {
      errorMessage: 'O número da nota fiscal é obrigatória',
      inputId: screen.createElementId('invoice-number'),
      check: () => Boolean(payload.invoice_number),
    },
    {
      check: () => Boolean(payload.received_at),
      errorMessage: 'A data de recebimento é obrigatória',
      inputId: screen.id + 'received_at',
    },
  ] as Validation[]
  const { validate } = useValidation(validations)
  const paginatedColumns = useMemo(
    () =>
      [
        {
          name: 'Nota fiscal',
          keyName: 'invoice_number',
          style: {
            minWidth: 70,
            maxWidth: 70,
          },
          filters: [{ name: 'Nota fiscal', type: 'text' }],
        },
        {
          name: 'Data de recebimento',
          filters: [{ name: 'Data de recebimento', type: 'from_date' }],
          keyName: 'received_at',
          formatText: (row) => new Date(row!.received_at!).toLocaleDateString(),
        },
        {
          name: 'Status de distribuição',
          formatText: (row: Good) => GoodStatusesNames[row.status],
          keyName: 'status',
          filters: [
            {
              name: 'Selecione os status',
              type: 'checkbox',
              value: [
                {
                  label: 'Distribuído',
                  value: GoodStatuses.DISTRIBUTED,
                },
                {
                  label: 'Não distribuído',
                  value: GoodStatuses.NOT_DISTRIBUTED,
                },
                {
                  label: 'Parcialmente distribuído',
                  value: GoodStatuses.PARTIAL_DISTRIBUTED,
                },
              ],
            },
          ],
        },
        {
          name: 'Valor total',
          formatText: (row) =>
            currencyFormat(
              row?.goods_products?.reduce(
                (t: number, c: GoodProduct) => t + c.value,
                0
              ) ?? 0
            ),
        },
      ] as Column<Good>[],
    []
  )
  const columns = useMemo(
    () =>
      [
        {
          name: 'Referencia',
          formatText: (row) => row?.product?.reference ?? '-',
        },
        {
          name: 'Produto',
          formatText: (row) => row?.product?.name ?? '-',
        },
        {
          name: 'Quantidade',
          formatText: (row) => row?.quantity ?? '0',
        },
        {
          name: 'Valor unitário',
          formatText: (row) =>
            currencyFormat((row!.value ?? 0) / (row!.quantity ?? 1)),
        },
        {
          name: 'Valor total',
          formatText: (row) => currencyFormat(row?.value ?? 0),
        },
      ] as Column<GoodProduct>[],
    []
  )

  const removeProduct = async () => {
    openAlert({
      text: 'Tem certeza que deseja remover o produto?',
      intent: 'warning',
      icon: 'warning-sign',
      onConfirm: async () => {
        try {
          setLoadingDeleteProduct(true)
          if (selectedGoodProduct!.id) {
            await GoodService.deleteGoodProduct(payload, selectedGoodProduct!)
          }
          setPayload((prev) => ({
            ...prev,
            goods_products: prev.goods_products?.filter(
              (g) => g.product_id !== selectedGoodProduct?.product_id
            ),
          }))
          setSelectedProduct(null)
        } catch (error) {
          showErrorMessage(
            error,
            'Não foi possível excluir o produto. Por favor, tente novamente'
          )
        } finally {
          setLoadingDeleteProduct(false)
        }
      },
    })
  }
  const handleAddProduct = () => {
    openSubScreen<AddProductToGoodProps>(
      {
        id: 'good-product-register',
      },
      screen.id,
      {
        onAddProduct: (p) => {
          setPayload((prev) => {
            if (
              prev.goods_products?.some((gp) => gp.product_id === p.product_id)
            ) {
              showWarningToast('O produto já foi adicionado a lista')
              return { ...prev }
            }
            return {
              ...prev,
              goods_products: [...(prev?.goods_products || []), p as any],
            }
          })
        },
      }
    )
  }
  const handleEditProduct = () => {
    openSubScreen<AddProductToGoodProps>(
      {
        id: 'good-product-register',
      },
      screen.id,
      {
        editMode: true,
        goodProduct: selectedGoodProduct,
        onAddProduct: (p, closeModal) => {
          setPayload((prev) => {
            const copy = { ...prev }
            const goodProductIndex = prev.goods_products!.findIndex(
              (gp) => gp.product_id === p.product_id
            )
            closeModal()
            if (goodProductIndex !== -1) {
              copy.goods_products![goodProductIndex] = p as any
              return copy
            }
            return copy
          })
        },
      }
    )
  }

  const { showSuccessToast, showWarningToast } = useToast()
  const { showErrorMessage } = useMessageError()
  const { openAlert } = useAlert()
  const createGood = async (stopLoad: StopLoadFunc) => {
    try {
      const response = await GoodService.create({
        status: GoodStatuses.NOT_DISTRIBUTED,
        supplier_id: supplierId,
        distributed_at: undefined,
        expected_receipt_date: (
          payload.expected_receipt_date as Date
        ).toISOString(),
        received_at: (payload.received_at as Date)?.toISOString(),
        requested_at: (payload.requested_at as Date)?.toISOString(),
        invoice_number: payload.invoice_number!,
        goods_products:
          (payload.goods_products?.map((gp) => ({
            product_id: gp.product_id,
            quantity: gp.quantity,
            value: gp.value,
          })) as any) || [],
      })

      showSuccessToast('Registro de mercadoria cadastrado com sucesso.')
      setPayload({
        ...response.data.data,
        received_at: new Date(response.data.data.received_at!),
      })
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      openAlert({
        text: 'Deseja distribuir suas mercadorias para seus estoques agora?',
      })
      screen.increaseScreenSize?.()
    } catch (error: any) {
      showErrorMessage(
        error,
        'Não foi possível fazer o cadastro do registro de mercadoria. Por favor, tente novamente'
      )
    }

    stopLoad()
  }

  const editGood = async (stopLoad: StopLoadFunc) => {
    try {
      await GoodService.update({
        ...payload,
        expected_receipt_date: (
          payload.expected_receipt_date as Date
        )?.toISOString(),
        received_at: (payload.received_at as Date)?.toISOString(),
        requested_at: (payload.requested_at as Date)?.toISOString(),
        goods_products: payload.goods_products?.filter((gp) => !gp.id),
      })
      showSuccessToast('O registro de mercadoria foi atualizado com sucesso.')
      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      screen.increaseScreenSize?.()
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível atualizar o registro de mercadoria. Por favor, tente novamente'
      )
    } finally {
      stopLoad()
    }
  }

  const handleSaveButtonClick = (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }

    if (!payload.goods_products?.length) {
      openAlert({
        text: 'Tem certeza que deseja cadastrar um registro de mercadorias que não possui mercadorias?',
        icon: 'warning-sign',
        intent: Intent.WARNING,
        confirmButtonText: 'CADASTRAR SEM MERCADORIA',
        onConfirm: doAction,
        onCancel() {
          stopLoad()
        },
        onClose() {
          stopLoad()
        },
      })
    } else {
      doAction()
    }

    async function doAction() {
      if (!payload.id) {
        createGood(stopLoad)
      } else {
        editGood(stopLoad)
      }
    }
  }

  const handleDistributeGoodButtonClick = () => {
    if (!payload.goods_products?.length) {
      showWarningToast(
        'A mercadoria não possui produtos que possam ser distribuídos'
      )
      return
    }

    openSubScreen<DistributeGoodsProps>(
      {
        id: 'distribute-goods',
      },
      screen.id,
      {
        good: payload,
      }
    )
  }
  const onRowSelect = useCallback((g: GoodProduct): void => {
    setSelectedProduct(g)
  }, [])
  const isGoodProductSelect = useCallback(
    (goodProduct: GoodProduct) =>
      goodProduct.product_id === selectedGoodProduct?.product_id,
    [selectedGoodProduct]
  )
  const onGoodSelect = (r: TableRow<Good>): void => {
    return setPayload({
      ...r,
      received_at: r.received_at ? new Date(r.received_at) : null,
      requested_at: r.requested_at ? new Date(r.requested_at as string) : null,
      expected_receipt_date: r.expected_receipt_date
        ? new Date(r.expected_receipt_date as string)
        : null,
    })
  }
  const getSupplierGoods = useCallback(
    (
      page: number,
      limit: number,
      filters: FilterType,
      options?: ReportRequestOption
    ) => GoodService.getAll(supplierId, page, limit, filters, options),
    []
  )
  const handleDeleteButtonOnClick = async (
    stopLoad: StopLoadFunc
  ): Promise<void> => {
    openAlert({
      text: 'Tem certeza que deseja remover essa mercadoria?',
      icon: 'warning-sign',
      intent: Intent.DANGER,
      onConfirm,
      onCancel: stopLoad,
    })

    async function onConfirm() {
      try {
        await GoodService.delete(payload)
        showSuccessToast('Mercadoria excluída com sucesso')
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        setPayload({})
      } catch (error) {
        showErrorMessage(
          error,
          'Não foi possível excluir a mercadoria. Por favor, tente novamente'
        )
      } finally {
        stopLoad()
      }
    }
  }
  return (
    <Container style={{ height: 'calc(100% - 95px)' }}>
      <Row>
        <RegistrationButtonBar
          handleSaveButtonOnClick={handleSaveButtonClick}
          handleDeleteButtonOnClick={handleDeleteButtonOnClick}
          screen={screen}
        />
      </Row>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='my-2'>
          <Bar>
            <Button
              intent={Intent.PRIMARY}
              onClick={handleDistributeGoodButtonClick}
              text='Distribuir mercadorias'
              disabled={
                !payload.id || payload.status === GoodStatuses.DISTRIBUTED
              }
            />
          </Bar>
        </Row>
        <Row className='h-100'>
          <PaginatedTable
            height='100%'
            customRequest={getSupplierGoods}
            containerProps={{
              style: {
                flex: 1,
              },
            }}
            columns={paginatedColumns}
            isSelected={(row: any) => row.id === payload?.id}
            onRowSelect={onGoodSelect}
            downloadable
            reportRequestOptions={[
              {
                reportType: 'csv',
                name: 'Mercadorias do fornecedor',
                responseType: 'text',
                mimeType: 'text/csv',
              },
              {
                reportType: 'pdf',
                name: 'Mercadorias do fornecedor',
                responseType: 'blob',
                mimeType: 'application/pdf',
              },
            ]}
          />
        </Row>
      </Render>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Box className='mt-2'>
          <Row>
            <InputText
              id={screen.createElementId('invoice-number')}
              value={payload.invoice_number ?? ''}
              label='Número da nota fiscal'
              onChange={(e) =>
                changePayloadAttribute('invoice_number', e.target.value)
              }
            />
            <InputDate
              inputProps={{
                style: { width: '100%' },
              }}
              timePrecision='minute'
              label='Data do pedido'
              id={screen.id + 'requested_at'}
              onChange={(d) => changePayloadAttribute('requested_at', d)}
              value={payload.requested_at as Date}
            />
            <InputDate
              inputProps={{
                style: { width: '100%' },
              }}
              timePrecision='minute'
              label='Data esperada de recebimento'
              id={screen.id + 'expected_receipt_date'}
              onChange={(d) =>
                changePayloadAttribute('expected_receipt_date', d)
              }
              value={payload.expected_receipt_date as Date}
            />
            <InputDate
              inputProps={{
                style: { width: '100%' },
              }}
              timePrecision='minute'
              label='Data de recebimento'
              id={screen.id + 'received_at'}
              onChange={(d) => changePayloadAttribute('received_at', d)}
              value={payload.received_at as Date}
            />
          </Row>
        </Box>

        <Row className='my-2'>
          <Bar>
            <ButtonGroup>
              <Button
                icon='add'
                onClick={handleAddProduct}
                intent={Intent.PRIMARY}
              >
                Adicionar produto
              </Button>
              <Render renderIf={!payload.id}>
                <Button
                  icon='edit'
                  onClick={handleEditProduct}
                  text='Editar'
                  disabled={
                    !selectedGoodProduct || Boolean(selectedGoodProduct.id)
                  }
                />
              </Render>

              <Button
                intent={Intent.DANGER}
                icon='trash'
                onClick={removeProduct}
                loading={loadingDeleteProduct}
                text='Remover'
                disabled={!selectedGoodProduct}
              />
            </ButtonGroup>
          </Bar>
        </Row>

        <Table<GoodProduct>
          rows={payload.goods_products ?? []}
          columns={columns}
          onRowSelect={onRowSelect}
          isSelected={isGoodProductSelect}
          rowKey={(g) => g.product_id}
        />
      </Render>
    </Container>
  )
}

export default GoodsScreen
