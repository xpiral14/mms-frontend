/* eslint-disable @typescript-eslint/no-unused-vars */
import { Callout, Dialog, DialogProps, Intent } from '@blueprintjs/core'
import React, { FC } from 'react'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import Product from '../../Contracts/Models/Product'
import ProductStock from '../../Contracts/Models/ProductStock'
import ProductStockWarning from '../../Contracts/Models/ProductStockWarning'
import Stock from '../../Contracts/Models/Stock'

export interface ProductStockWarnProps {
  productStockWarning: ProductStockWarning
  productStock: ProductStock
  stock: Stock
  product: Product
}

interface ProductStockWarnDialogProps extends ProductStockWarnProps, DialogProps {}
const index: FC<ProductStockWarnDialogProps> = ({
  stock,
  product,
  productStockWarning,
  productStock,
  ...props
}) => {
  return (
    <Dialog
      title='Alerta de estoque'
      {...props}
      className={Intent.WARNING}
    >
      <Container>
        <Row>
          <Callout icon='warning-sign' intent={Intent.WARNING}>
            O estoque <strong>{stock.name}</strong> possui um produto com o
            valor abaixo do valor mínimo definido no alerta.
          </Callout>
        </Row>
        <Container className='px-1'>
          <Row>
            <strong>Produto:</strong>
            {product.name}
          </Row>
          <Row>
            {' '}
            <strong>Quantidade definida no alerta:</strong>
            {productStockWarning.minimum} {product.unit_name}
          </Row>
          <Row>
            {' '}
            <strong>Quantidade atual:</strong>
            {productStock.quantity} {product.unit_name}
          </Row>
        </Container>
      </Container>
    </Dialog>
  )
}

export default index
