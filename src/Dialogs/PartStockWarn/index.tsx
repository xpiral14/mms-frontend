/* eslint-disable @typescript-eslint/no-unused-vars */
import { Callout, Dialog, DialogProps, Intent } from '@blueprintjs/core'
import React, { FC } from 'react'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import Part from '../../Contracts/Models/Part'
import PartStock from '../../Contracts/Models/PartStock'
import PartStockWarning from '../../Contracts/Models/PartStockWarning'
import Stock from '../../Contracts/Models/Stock'

export interface PartStockWarnProps {
  partStockWarning: PartStockWarning
  partStock: PartStock
  stock: Stock
  part: Part
}

interface PartStockWarnDialogProps extends PartStockWarnProps, DialogProps {}
const index: FC<PartStockWarnDialogProps> = ({
  stock,
  part,
  partStockWarning,
  partStock,
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
            {part.name}
          </Row>
          <Row>
            {' '}
            <strong>Quantidade definida no alerta:</strong>
            {partStockWarning.minimum} {part.unit_name}
          </Row>
          <Row>
            {' '}
            <strong>Quantidade atual:</strong>
            {partStock.quantity} {part.unit_name}
          </Row>
        </Container>
      </Container>
    </Dialog>
  )
}

export default index
