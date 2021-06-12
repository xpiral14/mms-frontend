import {
  Button,
  ButtonGroup,
  Divider,
  FormGroup,
  InputGroup,
  Intent,
} from '@blueprintjs/core'
import React from 'react'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { useAlert } from '../../../Hooks/useAlert'

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
    </div>
  )
}

export default CostumerRegister
