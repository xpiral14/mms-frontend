/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import RadioGroup from '../../../Components/RadioGroup'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import { PersonType, ScreenStatus } from '../../../Constants/Enums'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import Costumer from '../../../Contracts/Models/Costumer'
import { useAlert } from '../../../Hooks/useAlert'
import CostumerService from '../../../Services/CostumerService'
import { Container, Header, Body } from './style'

const CostumerRegister: React.FC<ScreenProps> = ({ screen }) => {
  const [status, setStatus] = useState(ScreenStatus.NEW)
  const [personType, setPersonType] = useState<PersonType>(PersonType.PHYSICAL)
  const [selectedCostumer, setSelectedCostumer] =
    useState<Costumer | null>(null)

  const isStatusCreate = () => status === ScreenStatus.NEW
  const isStatusEdit = () => status === ScreenStatus.EDIT
  const isStatusVizualize = () => status === ScreenStatus.VISUALIZE
  return (
    <Container>
      <Header>
        <RegistrationButtonBar
          status={status}
          setStatus={setStatus}
          screen={screen}
        />
      </Header>
      <Body>
        <form>
          <RadioGroup
            selectedValue={personType}
            label='Tipo de pessoa'
            inline
            disabled={isStatusVizualize()}
            radios={[
              {
                value: PersonType.PHYSICAL,
                label: 'Física',
              },
              {
                value: PersonType.LEGAL,
                label: 'Jurídica',
              },
            ]}
            onChange={(evt) =>
              setPersonType(evt.currentTarget.value as PersonType)
            }
          />
          <InputText
            defaultValue={selectedCostumer?.name}
            id='name'
            label='Nome do cliente'
            placeholder='Digite o nome do cliente'
            disabled={isStatusVizualize()}
            required
          />

          <InputText
            defaultValue={selectedCostumer?.email}
            id='Email'
            label='Email do cliente'
            placeholder='Digite o email do cliente'
            disabled={isStatusVizualize()}
          />
          <InputText
            defaultValue={selectedCostumer?.cpf}
            id='CPF'
            label='CPF'
            placeholder='Digite o email do cliente'
            disabled={isStatusVizualize()}
          />
          <InputText
            key={selectedCostumer?.phone}
            defaultValue={selectedCostumer?.phone}
            id='phone'
            mask='(99) 99999-9999'
            label='Telefone'
            placeholder='Digite o Telefone do cliente'
            disabled={isStatusVizualize()}
          />
        </form>

        <PaginatedTable
          containerProps={{
            style: {
              height: '200px',
              maxHeight: '100px',
              overflowY: 'scrool',
            },
          }}
          columns={[
            {
              id: 1,
              name: 'Nome',
              keyName: 'name',
            },
            {
              id: 1,
              name: 'CPF',
              keyName: 'cpf',
            },
            {
              id: 1,
              name: 'Telefone',
              keyName: 'phone',
            },
            {
              id: 1,
              name: 'Email',
              keyName: 'email',
            },
          ]}
          request={CostumerService.getAll as any}
          onRowSelect={(row) => {
            console.log(row)
            setSelectedCostumer(row)
          }}
        />
      </Body>
    </Container>
  )
}

export default CostumerRegister
