import { Card, Dialog, Elevation, Tab, Tabs } from '@blueprintjs/core'
import { useState } from 'react'
import Column from '../../Components/Layout/Column'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'

const tabs = [
  {
    name: 'Selecionar o plano',
    id: 0,
    Component: () => (
      <Row>
        <Column expand={4}>
          <Card interactive elevation={Elevation.THREE}>
            Esse é um plano
          </Card>
        </Column>
        <Column expand={4}>
          <Card interactive elevation={Elevation.THREE}>
            Esse é um plano
          </Card>
        </Column>
        <Column expand={4}>
          <Card interactive elevation={Elevation.THREE}>
            Esse é um plano
          </Card>
        </Column>
      </Row>
    ),
  },
  {
    name: 'Pagamento',
    id: 1,
    Component: () => <Row>hello world</Row>,
  },
]
const PaymentModal = (props: { isOpen?: boolean; onClose: () => void }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0])
  return (
    <Dialog
      {...props}
      style={{
        width: 700,
        height: 400,
        overflowY: 'scroll'
      }}
      title='Obter nova licensa'
    >
      <Container>
        <Row padding={10}>
          <Tabs
            onChange={(t) => setSelectedTab(tabs[t as number])}
            selectedTabId={selectedTab.id}
          >
            {tabs.map((step) => (
              <Tab
                key={step.id}
                id={step.id}
                title={step.name}
                panel={<step.Component />}
              />
            ))}
          </Tabs>
        </Row>
      </Container>
      <form>
        <button>Submit</button>
      </form>
    </Dialog>
  )
}

export default PaymentModal
