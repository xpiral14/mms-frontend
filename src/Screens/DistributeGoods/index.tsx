import { Intent } from '@blueprintjs/core'
import { useCallback, useState } from 'react'
import { RiFolderSharedLine } from 'react-icons/ri'
import Button from '../../Components/Button'
import Bar from '../../Components/Layout/Bar'
import Box from '../../Components/Layout/Box'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import DistributedGoodProduct from '../../Contracts/Models/DistributedGoodProduct'
import GoodProduct from '../../Contracts/Models/GoodProduct'
import GoodRegisterScreenProps from '../../Contracts/Screen/DistributeGoods'
import useMessageError from '../../Hooks/useMessageError'
import { useToast } from '../../Hooks/useToast'
import GoodService from '../../Services/GoodService'
import DistributeGoodProduct from './DistributeGoodProduct'

export default function DistributeGoods({
  good,
  screen,
}: GoodRegisterScreenProps) {
  const [loadingSaveDistribution, setLoadingSaveDistribution] = useState(false)
  const [distributedGoodProducts, setDistributedGoodProducts] = useState<
    Record<number, Partial<DistributedGoodProduct>[]>
  >(
    () =>
      good.goods_products?.reduce((acc, goodProduct) => {
        acc[goodProduct.id] =
          goodProduct.goods_distribution.map((goodDistribution) => ({
            id: goodDistribution.id,
            goodProductId: goodDistribution.good_product_id,
            productStockId: goodDistribution.product_stock_id,
            stockId: goodDistribution.stock_id,
            quantity: goodDistribution.quantity,
          })) ?? []
        return acc
      }, {} as Record<number, Partial<DistributedGoodProduct>[]>) ?? {}
  )
  const { showSuccessToast, showWarningToast } = useToast()
  const { showErrorMessage } = useMessageError()
  const handleOnSuccessRemove = (goodProduct: GoodProduct) => {
    setDistributedGoodProducts((prev) => {
      const copy = { ...prev }
      delete copy[goodProduct.id!]
      return copy
    })
  }
  const onSaveDistributedGoodProduct = useCallback(
    (
      goodProductId: number,
      distributedGoodProducts: Partial<DistributedGoodProduct>[]
    ) => {
      setDistributedGoodProducts((prev) => ({
        ...prev,
        [goodProductId]: distributedGoodProducts,
      }))
    },
    []
  )
  const distributeGoodProductsToStock = async () => {
    const goodProductsDistributionToSave = Object.values(
      distributedGoodProducts
    ).flat()
    if (!goodProductsDistributionToSave.length) {
      showWarningToast(
        'Não existe nenhuma distribuição disponivel para salvar. Clique no ícone de disquete nas quais deseja persistir as alterações.'
      )
      return
    }
    try {
      setLoadingSaveDistribution(true)
      await GoodService.distributeGoodProducts(
        good.supplier_id!,
        good.id!,
        goodProductsDistributionToSave
      )
      showSuccessToast('Mercadorias distribuídas com sucesso')
    } catch (error) {
      showErrorMessage(error, 'Não foi possível distribuir as mercadorias')
    } finally {
      setLoadingSaveDistribution(false)
    }
  }
  return (
    <Container>
      <Bar>
        <Button
          icon={<RiFolderSharedLine />}
          onClick={distributeGoodProductsToStock}
          intent={Intent.PRIMARY}
          loading={loadingSaveDistribution}
          text='Distribuir mercadorias para os estoques'
        />
      </Bar>
      <Row className='mt-2'>
        <Box className='flex gap-3 w-full'>
          <span>
            <strong>Nota fiscal: </strong> {good.invoice_number}
          </span>
          <span>
            <strong>Data de recebimento: </strong>{' '}
            {(good.received_at as Date)?.toLocaleDateString(undefined, {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </Box>
      </Row>

      {Object.entries(distributedGoodProducts).map(([dspId]) => {
        const goodProduct = good.goods_products?.find(
          (gp) => gp.id === Number(dspId)
        )
        return (
          <DistributeGoodProduct
            disabled={loadingSaveDistribution}
            key={goodProduct!.id}
            goodProduct={goodProduct!}
            screen={screen}
            onSave={onSaveDistributedGoodProduct}
            onSuccessRemove={handleOnSuccessRemove}
            distributedGoodProducts={
              distributedGoodProducts[goodProduct!.id] ?? []
            }
          />
        )
      })}
    </Container>
  )
}
