import Column from '../../../Components/Layout/Column'
import { Card, Colors, Elevation } from '@blueprintjs/core'
import { FC, useCallback, useState } from 'react'
import useAsync from '../../../Hooks/useAsync'
import LicenseService from '../../../Services/LicenseService'
import { useToast } from '../../../Hooks/useToast'
import { AiOutlineCheck } from 'react-icons/ai'
import { Container } from './styles'
import License from '../../../Contracts/Models/License'
import Row from '../../../Components/Layout/Row'
import Render from '../../../Components/Render'
import NumericInput from '../../../Components/NumericInput'

interface ChooseLicenseTabProps {
  onChoose: (licenses: License[]) => void
}

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const ChooseLicenseTab: FC<ChooseLicenseTabProps> = () => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [selectedLicenses, setSelectedLicenses] = useState<License[]>([])


  const { showErrorToast } = useToast()
  useAsync(async () => {
    try {
      const defintions = await LicenseService.getAvailableLicenses()
      setLicenses(defintions)
    } catch (e) {
      showErrorToast('Não foi possível obter as licensas disponíveis. Por favor, tente mais tarde')
    }
  }, [])

  const selectLicense = useCallback(
    (license: License) => {
      setSelectedLicenses(prev => {
        if (prev.some(l => l.id === license.id)) {
          return prev.filter(l => l.id !== license.id)
        }
        return prev.concat(license)
      })
    }, [],
  )
  return <Container>
    <Row>
      {licenses.map((license) =>
        <Column
          key={license.id}
          onClick={() => selectLicense(license)}
          style={{
            border: `2px solid ${selectedLicenses.some(l => l.id === license.id) ? Colors.BLUE1 : Colors.WHITE}`,
          }}
        >
          <Card interactive elevation={Elevation.THREE} className='license-container'>
            <h1 className='title'>{license.name}</h1>
            <span className='price'>{currencyFormat.format(license.price)}</span>

            <ul className='functionality-list'>
              {license.definition.features.map((functionality) => {
                const [title] = functionality.split(':')
                return <li key={functionality} style={{
                  paddingBottom: 10,
                }}>
                  <AiOutlineCheck color={Colors.FOREST1} />
                  <strong>{`${title}`}</strong>
                </li>
              })}
            </ul>
          </Card>
        </Column>,
      )}
      {licenses.map((license) =>
        <Column
          key={license.id}
          onClick={() => selectLicense(license)}
          style={{
            border: `2px solid ${selectedLicenses.some(l => l.id === license.id) ? Colors.BLUE1 : Colors.WHITE}`,
          }}
        >
          <Card interactive elevation={Elevation.THREE} className='license-container'>
            <h1 className='title'>{license.name}</h1>
            <span className='price'>{currencyFormat.format(license.price)}</span>

            <ul className='functionality-list'>
              {license.definition.features.map((functionality) => {
                const [title] = functionality.split(':')
                return <li key={functionality} style={{
                  paddingBottom: 10,
                }}>
                  <AiOutlineCheck color={Colors.FOREST1} />
                  <strong>{`${title}`}</strong>
                </li>
              })}
            </ul>
          </Card>
        </Column>,
      )}
    </Row>

    <Render renderIf={Boolean(selectLicense.length)}>
      {selectedLicenses.map((l => (
        <Row key={l.id}>
          <Row>
            <h2>{l.name}</h2>
          </Row>
          <Row>
            {l.definition.value_added_per_item['part'] &&
              <NumericInput id='payment-add-part' placeholder='Adicionar peças' />}
            {l.definition.value_added_per_item['service'] &&
              <NumericInput id='payment-add-part' placeholder='Adicionar serviços' />}
            {l.definition.value_added_per_item['customer'] &&
              <NumericInput id='payment-add-part' placeholder='Adicionar clientes' />}
            {l.definition.value_added_per_item['order_service'] &&
              <NumericInput id='payment-add-part' placeholder='Adicionar ordens de serviço' />}
          </Row>
        </Row>
      )))}
    </Render>
  </Container>
}

export default ChooseLicenseTab
