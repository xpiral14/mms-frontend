/* eslint-disable  @typescript-eslint/no-unused-vars*/
import GoodProduct from '../../Contracts/Models/GoodProduct'
import Box from '../../Components/Layout/Box'
import Collapse from '../../Components/Collapse'
import Row from '../../Components/Layout/Row'
import Select from '../../Components/Select'
import NumericInput from '../../Components/NumericInput'
import Render from '../../Components/Render'
import Button from '../../Components/Button'
import { Colors, Intent } from '@blueprintjs/core'
import React, { useMemo, useState } from 'react'
import Stock from '../../Contracts/Models/Stock'
import useMessageError from '../../Hooks/useMessageError'
import useAsync from '../../Hooks/useAsync'
import StockService from '../../Services/StockService'
import DistributedGoodProduct from '../../Contracts/Models/DistributedGoodProduct'
import { Option } from '../../Contracts/Components/Suggest'
import { Screen } from '../../Contracts/Components/ScreenProps'
import addEllipsis from '../../Util/addEllipsis'
import GoodService from '../../Services/GoodService'
import useValidation from '../../Hooks/useValidation'
import { Validation } from '../../Contracts/Hooks/useValidation'
import { useToast } from '../../Hooks/useToast'

type DistributedGoodProductContainerProps = {
  isCollapsed?: boolean;
  stockId?: number
  uniqueKey: string
}
export default function DistributeGoodProduct({ goodProduct, screen, onSuccessRemove }: {
  goodProduct: GoodProduct,
  screen: Screen,
  onSaveGoodDistributedGoodProduct?: () => void,
  onSuccessRemove?: (goodProduct: GoodProduct) => void
}) {
  const [loadingSave, setLoadingSave] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [distributedGoodProducts, setDistributedGoodProducts] = useState<Partial<DistributedGoodProduct & DistributedGoodProductContainerProps>[]>([{
    uniqueKey: Math.random().toString(),
  }])
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
  const { showErrorMessage } = useMessageError()

  const [loadingStocks, loadStocks] = useAsync(async () => {
    if (!goodProduct) {
      return
    }
    try {
      const response = await StockService.getStockThatHasProduct(goodProduct.product_id)
      setStocks(response.data.data)
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível obter a lista de estoques. Por favor, tente novamente.',
      )
    }
  }, [goodProduct])

  const changeDistributedGoodProductAttribute = (index: number, key: string, value: any) => {
    setDistributedGoodProducts(prev => {
      const copy = [...prev]
      copy[index] = {
        ...copy[index],
        [key]: value,
      }
      return copy
    })
  }
  const productStockOptions = useMemo(() => stocks.map((s) => ({
    stockId: s.id,
    options: s.product_stocks?.map(s => ({
      label: s.product?.name,
      value: s.id,
    })) as Option[],
  })), [stocks])

  const totalDistributed = useMemo(() => distributedGoodProducts.reduce((c, a) => c + (a.quantity ?? 0), 0), [distributedGoodProducts])

  const validations = [
    {
      check: () => !(totalDistributed !== goodProduct.quantity) || totalDistributed > goodProduct.quantity,
      errorMessage: 'A distribuição dos produtos deve ser completa',
    },
    {
      check: () => !(totalDistributed !== goodProduct.quantity) || totalDistributed < goodProduct.quantity,
      errorMessage: 'A distribuição dos produtos não pode ser maior do que a quantidade da mercadoria',
    },
    {
      check: () => distributedGoodProducts.every(dgp => dgp.stockId && dgp.productStockId),
      errorMessage: 'Todos produtos devem ser distribuídos para um estoque',
    },
  ] as Validation[]
  const { validate } = useValidation(validations)

  const {showErrorToast} = useToast()

  const handleSaveClick = async (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    if (!validate()) {
      return
    }
    setLoadingSave(true)
    try {
      await Promise.all(
        [
          ...distributedGoodProducts.filter(dgp => !dgp.id).map((dgp) => GoodService.createDistributedGoodProduct(goodProduct.good_id, dgp)),
          distributedGoodProducts.filter(dgp => dgp.id).map((dgp) => GoodService.updateDistributedGoodProduct(goodProduct.good_id, dgp)),
        ],
      )
      await Promise.all(distributedGoodProducts.filter(dgp => !dgp.id).map((dgp) => GoodService.createDistributedGoodProduct(goodProduct.good_id, dgp)))
    } catch (error) {
      showErrorMessage(error, 'Houve um erro ao tentar salvar a distribuição de produtos. Por favor, tente novamente.')
    }finally {
      setLoadingSave(false)
    }
  }
  const handleRemoveClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    onSuccessRemove?.(goodProduct)
  }
  return <Box className='mt-2'>
    <Collapse
      title={
        <div className='d-flex justify-content-between w-100'>
          <span>{addEllipsis(goodProduct?.product.name ?? '', 45)}</span>
          <div className='d-flex gap-1'>
            <span style={{
              color: totalDistributed > goodProduct.quantity ? Colors.RED3 : undefined,
            }}>{totalDistributed} de {goodProduct.quantity} distribuído(s)</span>
            <div>
              <Button
                help='Salvar distribuição'
                icon='floppy-disk'
                intent={Intent.SUCCESS} small
                onClick={handleSaveClick}
                loading={loadingSave}
              />
              <Button help='Remover distribuição' icon='trash' small intent={Intent.DANGER}
                onClick={handleRemoveClick} />
            </div>
          </div>
        </div>
      }
      isCollapsed={collapsed}
      onChange={() => setCollapsed(prev => !prev)}
    >
      <Row style={{ maxHeight: 150, overflowY: 'scroll' }}>
        {distributedGoodProducts.map((dsp, i, dgps) =>
          <Row className='align-items-center' key={dsp.id}>
            <Select
              buttonWidth='200px'
              label='Estoque'
              items={stockOptions}
              activeItem={dsp.stockId}
              onItemSelect={o => {
                changeDistributedGoodProductAttribute(i, 'stockId', o.value)
                changeDistributedGoodProductAttribute(i, 'productStockId', undefined)
                changeDistributedGoodProductAttribute(i, 'quantity', 0)

              }}
              disabled={!goodProduct}
              loading={loadingStocks}
              handleButtonReloadClick={loadStocks}
            />
            <Select
              buttonWidth='150px'
              label='Produto do estoque'
              items={productStockOptions.find(pso => pso.stockId === dsp.stockId)?.options ?? []}
              activeItem={dsp?.productStockId}
              onItemSelect={(o) => {
                changeDistributedGoodProductAttribute(i, 'productStockId', o.value)
              }}
              disabled={!dsp.stockId}
            />
            <NumericInput label='Quantidade' id={screen.createElementId('quantity')} style={{ flex: 1 }}
              value={dsp.quantity ?? 0}
              min={0}
              max={goodProduct.quantity}
              onValueChange={(v) => {
                changeDistributedGoodProductAttribute(i, 'quantity', v)
              }}
            />
            <div>
              <Render renderIf={dgps.length > 1}>
                <Button minimal intent={Intent.DANGER} icon='delete' onClick={() => {
                  setDistributedGoodProducts(prev => prev.filter((i => i.uniqueKey !== dsp.uniqueKey)))
                }} />
              </Render>
              <Render renderIf={i === dgps.length - 1}>
                <Button minimal intent={Intent.PRIMARY} icon='add' onClick={() => {
                  setDistributedGoodProducts(prev => [...prev, { uniqueKey: Math.random().toString() }])
                }} />
              </Render>
            </div>
          </Row>)}
      </Row>
    </Collapse>

  </Box>
}
