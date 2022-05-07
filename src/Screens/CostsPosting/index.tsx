import React, { FunctionComponent, useMemo, useState } from 'react'
import Collapse from '../../Components/Collapse'
import InputDate from '../../Components/InputDate'
import Box from '../../Components/Layout/Box'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import NumericInput from '../../Components/NumericInput'
import Select from '../../Components/Select'
import TextArea from '../../Components/TextArea'
import ScreenProps from '../../Contracts/Components/ScreenProps'
import Order from '../../Contracts/Models/Order'
import useAsync from '../../Hooks/useAsync'
import OrderService from '../../Services/OrderService'

interface OwnProps extends ScreenProps {
  order?: any
}

type Props = OwnProps

const CostPosting: FunctionComponent<Props> = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, loadOrders] = useAsync(async () => {
    const response = await OrderService.getAll(1, 1000, {})
    setOrders(response.data.data)
  }, [])

  const orderOptions = useMemo(
    () =>
      orders.map((o) => ({
        label: String(o.reference ?? o.id),
        value: o.id,
      })),
    [orders]
  )
  return (
    <Container>
      <Box className='mb-3'>
        <Collapse title='Dados do custo'>
          <Row>
            <NumericInput id='' label='Valor' />
            <InputDate id='' label='Data do custo' />
            <Select label='Categoria do custo' />
          </Row>
          <Row>
            <TextArea style={{ flex: 1 }} id='' label='Descrição do custo' />
          </Row>
        </Collapse>
      </Box>
      <Box>
        <Collapse title='Detalhes do custo'>
          <Row>
            <Select
              label='Pedido'
              items={orderOptions}
              loading={loadingOrders}
              handleButtonReloadClick={loadOrders}
            />
          </Row>
          <Row>
            <TextArea style={{ flex: 1 }} id='' label='Anotações' />
          </Row>
        </Collapse>
      </Box>
    </Container>
  )
}

export default CostPosting
