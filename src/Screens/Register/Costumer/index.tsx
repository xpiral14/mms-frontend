import {
  Button,
  ButtonGroup,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core'
import { EditableCell } from '@blueprintjs/table'
import React from 'react'
import PaginatedTable from '../../../Components/PaginatedTable'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { useAlert } from '../../../Hooks/useAlert'
import CostumerService from '../../../Services/CostumerService'

const CostumerRegister: React.FC<ScreenProps> = () => {
  const { openAlert } = useAlert()
  return (
    <div>
      <ButtonGroup style={{ minWidth: '100%' }}>
        <Button
          intent={Intent.SUCCESS}
          icon='add'
          onClick={() =>
            openAlert({
              text: 'Criar funcionário?',
              intent: 'success',
              confirmButtonText: 'Criar',
              cancelButtonText: 'Cancelar',
              onConfirm: () =>
                openAlert({
                  text: 'Funcionário criado com sucesso',
                  intent: 'success',
                }),
            })
          }
        >
          Criar
        </Button>
        <Button intent={Intent.PRIMARY} icon='edit'>
          Editar
        </Button>
        <Button intent={Intent.NONE} icon='floppy-disk'>
          Atualizar
        </Button>
        <Button intent={Intent.DANGER} icon='trash'>
          Remover
        </Button>
      </ButtonGroup>
      <Divider style={{ margin: '5px 0' }} />

      <div>
        <FormGroup
          disabled={false}
          helperText={'Helper text with details...'}
          inline={false}
          intent={Intent.PRIMARY}
          label={'Label'}
          labelFor='text-input'
          labelInfo={'(required)'}
        >
          <InputGroup
            id='text-input'
            placeholder='Placeholder text'
            disabled={false}
            intent={Intent.NONE}
          />
        </FormGroup>
      </div>

      <PaginatedTable
        columns={[
          {
            id: 1,
            name: 'Nome',
            cellRenderer: (cell) => <EditableCell value = {cell.name} />
          },
          {
            id: 1,
            name: 'Nome',
            keyName: 'cpf',
            className: 'w-100'
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
        request={CostumerService.getAll}
      />
    </div>
  )
}

export default CostumerRegister
