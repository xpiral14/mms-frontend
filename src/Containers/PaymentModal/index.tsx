import { Drawer, Intent, Tab, Tabs } from '@blueprintjs/core'
import { useMemo, useState } from 'react'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import Column from '../../Components/Layout/Column'
import ChooseLicenseTab from './Tabs/ChooseLicenseTab'
import Button from '../../Components/Button'
// import PaymentTab from './Tabs/PaymentTab'

const PaymentModal = (props: { isOpen?: boolean; onClose: () => void }) => {
  const tabs = useMemo(() => [
    {
      name: 'Selecionar o plano',
      id: 0,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      Component: () => <ChooseLicenseTab onChoose={() => {
      }} />,
      nextTab: 1,
    },
    {
      name: 'Pagamento',
      id: 1,
      Component: () => <>hello world</>,
      nextTab: undefined,
    },
  ], [])

  const [selectedTab, setSelectedTab] = useState(tabs[0])

  return (
    <Drawer
      {...props}
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
                style={{
                  width: '100%',
                }
                }
                key={step.id}
                id={step.id}
                title={step.name}
                panel={<step.Component />}
              />
            ))}
          </Tabs>
        </Row>

        <Row padding='0 0 0 10px'>
          <Column expand={1}>
            <Button
              intent={Intent.PRIMARY}
              onClick={() => setSelectedTab(prev => tabs[prev.nextTab ?? 0])}
            >
              Obter licença
            </Button>
          </Column>
        </Row>
      </Container>
    </Drawer>
  )
}

export default PaymentModal
