import React from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body, styles } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import PartsService from '../../../Services/PartsService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'

const PartsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  return (
    <Container>
      <Header>
        <RegistrationButtonBar screen={screen} />
      </Header>

      <Body>
        <div style={styles.flexRow}>
          <form style={{ display: 'flex' }}>
            <InputText id='partId' label='Id:' disabled={true} itent='none' />

            <InputText
              id='partReference'
              label='Referência:'
              disabled={true}
              itent='primary'
            />

            <InputText
              id='partName'
              label='Nome:'
              disabled={false}
              itent='primary'
            />

            <InputText
              id='partDescription'
              label='Descrição:'
              disabled={false}
              itent='primary'
            />

            <InputText
              id='partPrice'
              label='Preço:'
              disabled={false}
              itent='primary'
            />
          </form>
        </div>

        <div style={styles.tableRow}>
          <PaginatedTable
            columns={[
              {
                id: 1,
                name: 'Referencia',
                keyName: 'reference',
              },
              {
                id: 2,
                name: 'Nome',
                keyName: 'name',
              },
              {
                id: 3,
                name: 'Descrição',
                keyName: 'description',
              },
              {
                id: 4,
                name: 'Preço',
                keyName: 'price',
              },
            ]}
            request={PartsService.getAll}
          />
        </div>
      </Body>
    </Container>
  )
}

export default PartsScreen
