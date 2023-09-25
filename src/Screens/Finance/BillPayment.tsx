import React from 'react'
import Container from '../../Components/Layout/Container'
import Box from '../../Components/Layout/Box'
import PaymentTypeSelect from '../../Components/ScreenComponents/PaymentTypeSelect'
import Transaction from '../../Contracts/Models/Transaction'
import Bar from '../../Components/Layout/Bar'
import Button from '../../Components/Button'
import { Intent } from '@blueprintjs/core'
import { MdPayment } from 'react-icons/md'
import Row from '../../Components/Layout/Row'
import TextArea from '../../Components/ScreenComponents/TextArea'

const BillPayment = () => {
  return (
    <Container>
      <Bar>
        <Button intent={Intent.SUCCESS} text='Pagar' icon={<MdPayment />} />
      </Bar>
      <Box>
        <Row>
          <PaymentTypeSelect<Transaction>
            name='type'
            buttonWidth='100%'
            label='Forma de pagamento' 
          />
        </Row>
        <Row>
          <TextArea<Transaction>
            name='annotation'
            id='bill-payment-id'
            style={{ width: '100%' }}
            label='Anotações'
          />
        </Row>
      </Box>
    </Container>
  )
}

export default BillPayment
