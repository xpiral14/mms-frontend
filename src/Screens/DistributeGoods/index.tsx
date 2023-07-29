/* eslint-disable @typescript-eslint/no-unused-vars */

import Container from '../../Components/Layout/Container'
import Box from '../../Components/Layout/Box'
import GoodRegisterScreenProps from '../../Contracts/Screen/DistributeGoods'
import Row from '../../Components/Layout/Row'
import { useMemo, useState } from 'react'
import { Option } from '../../Contracts/Components/Suggest'
import currencyFormat from '../../Util/currencyFormat'
import Select from '../../Components/Select'
import GoodProduct from '../../Contracts/Models/GoodProduct'
import DistributedGoodProduct from '../../Contracts/Models/DistributedGoodProduct'
import useAsync from '../../Hooks/useAsync'
import StockService from '../../Services/StockService'
import Stock from '../../Contracts/Models/Stock'
import useMessageError from '../../Hooks/useMessageError'
import ProductStock from '../../Contracts/Models/ProductStock'
import addEllipsis from '../../Util/addEllipsis'
import Collapse from '../../Components/Collapse'
import Button from '../../Components/Button'
import Render from '../../Components/Render'
import { Intent } from '@blueprintjs/core'
import NumericInput from '../../Components/NumericInput'
import DistributeGoodProduct from './DistributeGoodProduct'
import Bar from '../../Components/Layout/Bar'
import { RiFolderSharedLine } from 'react-icons/ri'

export default function DistributeGoods({ good, screen }: GoodRegisterScreenProps) {
  const [goodProduct, setGoodProduct] = useState<GoodProduct | null>(null)
  const goodProductOptions = useMemo(() => good.good_products?.map(gp => ({
    label: `Produto: ${gp.product.name} | Quantidade: ${gp.quantity} | Valor total: ${currencyFormat(gp.value)}`,
    value: gp.id,
  })) as Option[], [good])
  const [distributedGoodProducts, setDistributedGoodProducts] = useState<Record<number, Partial<DistributedGoodProduct>[]>>({})

  const handleOnSuccessRemove = (goodProduct: GoodProduct) => {
    setDistributedGoodProducts(prev => {
      const copy = {...prev}
      delete copy[goodProduct.id!]
      return copy
    })
  }

  return <Container>
    <Bar>
      <Button icon={<RiFolderSharedLine />} intent={Intent.PRIMARY} text='distribuir mercadorias para os estoques' />
    </Bar>
    <Row className='mt-2'>
      <Box className='d-flex gap-3 w-100'>
        <span><strong>Nota fiscal: </strong> {good.invoice_number}</span>
        <span><strong>Data de recebimento: </strong> {(good.received_at as Date)?.toLocaleDateString(undefined, {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}</span>
      </Box>
    </Row>
    <Row className='mt-3'>
      <Select
        fill
        items={goodProductOptions}
        buttonWidth='100%'
        activeItem={goodProduct?.id}
        onItemSelect={(o) => {
          setGoodProduct(good.good_products?.find(gp => gp.id === o.value) ?? null)
          setDistributedGoodProducts(prev => ({
            ...prev,
            [o.value as number]: [{}],
          }))
        }}
      />
    </Row>

    {Object.entries(distributedGoodProducts).map(([dspId]) => {
      const goodProduct = good.good_products?.find(gp => gp.id === Number(dspId))
      return <DistributeGoodProduct key={goodProduct!.id} goodProduct={goodProduct!} screen={screen}
        onSuccessRemove={handleOnSuccessRemove} />
    },
    )}
  </Container>
}
