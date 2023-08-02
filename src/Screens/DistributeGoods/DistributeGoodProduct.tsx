import GoodProduct from '../../Contracts/Models/GoodProduct'
import Box from '../../Components/Layout/Box'
import Collapse from '../../Components/Collapse'
import Row from '../../Components/Layout/Row'
import Select from '../../Components/Select'
import NumericInput from '../../Components/NumericInput'
import Render from '../../Components/Render'
import Button from '../../Components/Button'
import { Colors, Intent } from '@blueprintjs/core'
import React, { useEffect, useMemo, useState } from 'react'
import Stock from '../../Contracts/Models/Stock'
import useMessageError from '../../Hooks/useMessageError'
import useAsync from '../../Hooks/useAsync'
import StockService from '../../Services/StockService'
import DistributedGoodProduct from '../../Contracts/Models/DistributedGoodProduct'
import { Option } from '../../Contracts/Components/Suggest'
import { Screen } from '../../Contracts/Components/ScreenProps'
import addEllipsis from '../../Util/addEllipsis'
import useValidation from '../../Hooks/useValidation'
import { Validation } from '../../Contracts/Hooks/useValidation'

type DistributedGoodProductContainerProps = {
  isCollapsed?: boolean
  stockId?: number
  uniqueKey: string
}
enum ActionState {
  EDIT,
  VIEW,
}
export default function DistributeGoodProduct({
  disabled,
  goodProduct,
  screen,
  onSuccessRemove,
  onSave,
  distributedGoodProducts: defaultDistributedGoodProducts,
}: {
  disabled?: boolean
  goodProduct: GoodProduct
  screen: Screen
  onSave: (
    goodProductId: number,
    distributedGoodProduct: Partial<DistributedGoodProduct>[]
  ) => void
  onSaveGoodDistributedGoodProduct?: () => void
  onSuccessRemove?: (goodProduct: GoodProduct) => void
  distributedGoodProducts?: Partial<DistributedGoodProduct>[]
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [state, setState] = useState<ActionState>(ActionState.EDIT)
  const [distributedGoodProducts, setDistributedGoodProducts] = useState<
    Partial<DistributedGoodProduct & DistributedGoodProductContainerProps>[]
  >(
    defaultDistributedGoodProducts?.length
      ? defaultDistributedGoodProducts.map((goodsDistribution) => ({
        ...goodsDistribution,
        uniqueKey: Math.random().toString(),
      }))
      : [
        {
          uniqueKey: Math.random().toString(),
          goodProductId: goodProduct.id,
        },
      ]
  )
  const [stocks, setStocks] = useState<Stock[]>([])
  const stockOptions: Option[] = useMemo(() => {
    const options = stocks.map((s) => ({
      label: s.name,
      value: s.id,
    }))
    const firstOption = {
      label: 'Selecionar produtos',
      value: 0,
    }
    return options.length ? [firstOption, ...options] : []
  }, [stocks])

  useEffect(() => {
    if (defaultDistributedGoodProducts?.length) {
      setDistributedGoodProducts(defaultDistributedGoodProducts)
    }
  }, [defaultDistributedGoodProducts])
  const { showErrorMessage } = useMessageError()

  const [loadingStocks, loadStocks] = useAsync(async () => {
    if (!goodProduct) {
      return
    }
    try {
      const response = await StockService.getStockThatHasProduct(
        goodProduct.product_id
      )
      setStocks(response.data.data)
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível obter a lista de estoques. Por favor, tente novamente.'
      )
    }
  }, [goodProduct])

  const changeDistributedGoodProductAttribute = (
    index: number,
    key: string,
    value: any
  ) => {
    setDistributedGoodProducts((prev) => {
      const copy = [...prev]
      copy[index] = {
        ...copy[index],
        [key]: value,
      }
      return copy
    })
  }
  const productStockOptions = useMemo(
    () =>
      stocks.map((s) => ({
        stockId: s.id,
        options: s.product_stocks?.map((s) => ({
          label: s.product?.name,
          value: s.id,
        })) as Option[],
      })),
    [stocks]
  )

  const totalDistributed = useMemo(
    () => distributedGoodProducts.reduce((c, a) => c + (a.quantity ?? 0), 0),
    [distributedGoodProducts]
  )

  const validations = [
    {
      check: () => distributedGoodProducts.every((dsp) => Boolean(dsp.stockId)),
      errorMessage: 'Selecione o estoque.',
    },
    {
      check: () =>
        distributedGoodProducts.every((dsp) => Boolean(dsp.productStockId)),
      errorMessage: 'Selecione o produto no estoque.',
    },
    {
      check: () =>
        !(totalDistributed !== goodProduct.quantity) ||
        totalDistributed > goodProduct.quantity,
      errorMessage: 'A distribuição dos produtos deve ser completa',
    },
    {
      check: () =>
        !(totalDistributed !== goodProduct.quantity) ||
        totalDistributed < goodProduct.quantity,
      errorMessage:
        'A distribuição dos produtos não pode ser maior do que a quantidade da mercadoria',
    },
  ] as Validation[]
  const { validate } = useValidation(validations)

  const handleSaveClick = async (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation()
    if (!validate()) {
      return
    }
    onSave(goodProduct.id, distributedGoodProducts)
    setState(ActionState.VIEW)
  }
  const handleRemoveClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    onSuccessRemove?.(goodProduct)
  }
  const handleEditClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    setState(ActionState.EDIT)
    setCollapsed(false)
  }
  return (
    <Box className='mt-2'>
      <Collapse
        title={
          <div className='d-flex justify-content-between w-100'>
            <span>{addEllipsis(goodProduct?.product.name ?? '', 45)}</span>
            <div className='d-flex gap-1'>
              <span
                style={{
                  color:
                    totalDistributed > goodProduct.quantity
                      ? Colors.RED3
                      : undefined,
                }}
              >
                <Render renderIf={!goodProduct.has_distributed}>
                  {totalDistributed} de {goodProduct.quantity} distribuído(s)
                </Render>
                <Render renderIf={goodProduct.has_distributed}>
                  <span style={{ color: Colors.GREEN1 }}>
                    Mercadoria totalmente distribuída
                  </span>
                </Render>
              </span>
              <div className='flex justify-content'>
                <Render renderIf={state === ActionState.EDIT}>
                  <Button
                    help={
                      !goodProduct.has_distributed
                        ? 'Salvar distribuição'
                        : undefined
                    }
                    icon='floppy-disk'
                    intent={Intent.SUCCESS}
                    small
                    onClick={handleSaveClick}
                    disabled={goodProduct.has_distributed || disabled}
                  />
                </Render>
                <Render renderIf={state === ActionState.VIEW}>
                  <Button
                    help='Editar distribuição'
                    icon='edit'
                    intent={Intent.PRIMARY}
                    small
                    onClick={handleEditClick}
                    disabled={goodProduct.has_distributed || disabled}
                  />
                </Render>
                <Button
                  help='Remover distribuição'
                  icon='trash'
                  small
                  intent={Intent.DANGER}
                  onClick={handleRemoveClick}
                  disabled={goodProduct.has_distributed || disabled}
                />
              </div>
            </div>
          </div>
        }
        isCollapsed={collapsed}
        onChange={() => setCollapsed((prev) => !prev)}
      >
        <Row style={{ maxHeight: 150, overflowY: 'scroll' }}>
          {distributedGoodProducts.map((dsp, i, dgps) => (
            <Row className='align-items-center' key={dsp.id}>
              <Select
                buttonWidth='200px'
                label='Estoque'
                required
                items={stockOptions}
                activeItem={dsp.stockId}
                onItemSelect={(o) => {
                  changeDistributedGoodProductAttribute(i, 'stockId', o.value)
                  changeDistributedGoodProductAttribute(
                    i,
                    'productStockId',
                    undefined
                  )
                  changeDistributedGoodProductAttribute(i, 'quantity', 0)
                }}
                disabled={goodProduct.has_distributed || disabled}
                loading={loadingStocks}
                handleButtonReloadClick={loadStocks}
              />
              <Select
                buttonWidth='150px'
                required
                label='Produto do estoque'
                items={
                  productStockOptions.find((pso) => pso.stockId === dsp.stockId)
                    ?.options ?? []
                }
                activeItem={dsp?.productStockId}
                onItemSelect={(o) => {
                  changeDistributedGoodProductAttribute(
                    i,
                    'productStockId',
                    o.value
                  )
                }}
                disabled={!dsp.stockId || disabled}
              />
              <NumericInput
                label='Quantidade'
                required
                id={screen.createElementId('quantity')}
                style={{ flex: 1 }}
                value={dsp.quantity ?? 0}
                min={0}
                max={goodProduct.quantity}
                disabled={
                  goodProduct.has_distributed || !dsp.productStockId || disabled
                }
                onValueChange={(v) => {
                  changeDistributedGoodProductAttribute(i, 'quantity', v)
                }}
              />
              <div>
                <Render renderIf={dgps.length > 1}>
                  <Button
                    minimal
                    intent={Intent.DANGER}
                    icon='delete'
                    onClick={() => {
                      setDistributedGoodProducts((prev) =>
                        prev.filter((i) => i.uniqueKey !== dsp.uniqueKey)
                      )
                    }}
                    disabled={goodProduct.has_distributed || disabled}
                  />
                </Render>
                <Render renderIf={i === dgps.length - 1}>
                  <Button
                    minimal
                    intent={Intent.PRIMARY}
                    icon='add'
                    onClick={() => {
                      setDistributedGoodProducts((prev) => [
                        ...prev,
                        {
                          uniqueKey: Math.random().toString(),
                          goodProductId: goodProduct.id,
                        },
                      ])
                    }}
                    disabled={goodProduct.has_distributed || disabled}
                  />
                </Render>
              </div>
            </Row>
          ))}
        </Row>
      </Collapse>
    </Box>
  )
}
