import React, { FC, useState, useMemo } from 'react'
import { AddProductToGoodScreenProps } from '../../Contracts/Screen/AddProductToGood'
import useAsync from '../../Hooks/useAsync'
import ProductsService from '../../Services/ProductsService'
import { useToast } from '../../Hooks/useToast'
import Product from '../../Contracts/Models/Product'
import { Option } from '../../Contracts/Components/Suggest'
import Select from '../../Components/Select'
import { useWindow } from '../../Hooks/useWindow'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NumericInput from '../../Components/NumericInput'
import Bar from '../../Components/Layout/Bar'
import Button from '../../Components/Button'
import { Intent } from '@blueprintjs/core'
import GoodProduct from '../../Contracts/Models/GoodProduct'

const AddProductToGood: FC<AddProductToGoodScreenProps> = ({
  onAddProduct,
  screen,
}) => {
  const [products, setProducts] = useState<Product[]>([])

  const { changePayloadAttribute, payload, setPayload } = useWindow<GoodProduct>()

  const { showErrorToast } = useToast()
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

  const handleProductSelect = (option: Option) => {
    setPayload(prev => ({
      ...prev,
      product_id: option.value as number,
      product: products.find(p => p.id === option.value)
    }))
  }

  return (
    <Container>
      <Row>
        <Bar>
          <Button intent={Intent.PRIMARY} onClick={() => onAddProduct(payload)}>
            Adicionar produto à mercadoria
          </Button>
        </Bar>
      </Row>
      <Row>
        <Select
          required
          label='Produto'
          onChange={handleProductSelect}
          id={screen.id + 'productIdSelect'}
          items={productOptions}
          activeItem={payload.product?.id}
          loading={loadingProducts}
          handleButtonReloadClick={loadProducts}
          buttonWidth={100}
        />

        <NumericInput
          label='Quantidade'
          id={screen.id + 'product_quantity'}
          onValueChange={(v) => {
            changePayloadAttribute('quantity', v)
          }}
        />
        <NumericInput
          label='Valor total'
          id={screen.id + 'product_quantity_value'}
          onValueChange={(v) => {
            changePayloadAttribute('value', v)
          }}
        />
      </Row>
    </Container>
  )
}

export default AddProductToGood
