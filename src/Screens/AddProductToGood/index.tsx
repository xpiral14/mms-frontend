import React, { FC, useState, useMemo, useEffect } from 'react'
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
import useValidation from '../../Hooks/useValidation'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Box from '../../Components/Layout/Box'

const AddProductToGood: FC<AddProductToGoodScreenProps> = ({
  editMode,
  onAddProduct,
  goodProduct,
  screen,
}) => {
  const [products, setProducts] = useState<Product[]>([])

  const validations = [
    {
      inputId: screen.id + '-product-select',
      errorMessage: 'O código do produto é obrigatório',
      check: () => Boolean(payload.product_id),
    },
    {
      inputId: screen.id + 'product-quantity',
      errorMessage: 'A quantidade do produto é obrigatória',
      check: () => Boolean(payload.quantity),
    },
    {
      inputId: screen.id + '-product-quantity-value',
      errorMessage: 'O valor total é obrigatório',
      check: () => Boolean(payload.value),
    },
  ] as Validation[]
  const { validate } = useValidation(validations)
  const { changePayloadAttribute, payload, setPayload } =
    useWindow<GoodProduct>()
  useEffect(() => {
    if (goodProduct) {
      console.log('aqui')
      setPayload(goodProduct)
    }
  }, [goodProduct])
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
    setPayload((prev) => ({
      ...prev,
      product_id: option.value as number,
      product: products.find((p) => p.id === option.value),
    }))
  }
  return (
    <Container>
      <Row>
        <Bar>
          <Button
            intent={Intent.PRIMARY}
            icon={editMode ? 'edit' : 'floppy-disk'}
            onClick={() => {
              if (!validate()) {
                return
              }
              onAddProduct(payload, screen.close)
              setPayload({})
            }}
          >
            {editMode ? 'Salvar edição' : 'Adicionar produto à mercadoria'}
          </Button>
        </Bar>
      </Row>
      <Box className='mt-2'>
        <Row>
          <Select
            required
            label='Produto'
            onChange={handleProductSelect}
            id={screen.id + '-product-select'}
            items={productOptions}
            activeItem={payload.product?.id}
            loading={loadingProducts}
            disabled={editMode}
            handleButtonReloadClick={loadProducts}
            fill
          />
        </Row>
      </Box>
      <Box className='mt-2'>
        <Row>
          <NumericInput
            label='Quantidade'
            value={payload.quantity ?? 0}
            id={screen.id + 'product-quantity'}
            stepSize={0.1}
            onValueChange={(v) => {
              changePayloadAttribute('quantity', v)
            }}
          />
          <NumericInput
            label='Valor total'
            allowNumericCharactersOnly={false}
            value={payload.value ?? 0}
            id={screen.id + '-product-quantity-value'}
            onValueChange={(v) => {
              changePayloadAttribute('value', v)
            }}
          />
        </Row>
      </Box>
    </Container>
  )
}

export default AddProductToGood
