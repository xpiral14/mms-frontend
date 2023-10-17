import React, { useEffect } from 'react'
import InputText from '../../Components/InputText'
import ScreenProps from '../../Contracts/Components/ScreenProps'

import { useWindow } from '../../Hooks/useWindow'
import { PersonType, ScreenStatus } from '../../Constants/Enums'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Render from '../../Components/Render'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import { useAuth } from '../../Hooks/useAuth'
import User from '../../Contracts/Models/User'
import UserService from '../../Services/UserService'
import Bar from '../../Components/Layout/Bar'
import useValidation from '../../Hooks/useValidation'
import { Button, ButtonGroup, Intent } from '@blueprintjs/core'
import useMessageError from '../../Hooks/useMessageError'
import { useToast } from '../../Hooks/useToast'
import cleanNumericInput from '../../Util/cleanNumericInput'

const UnitsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { auth, setAuth } = useAuth()
  const { showSuccessToast } = useToast()
  const {
    payload,
    setPayload,
    screenStatus,
    setScreenStatus,
    isScreenStatusVizualize,
    isScreenStatusEdit,
  } = useWindow<User>()

  useEffect(() => {
    setPayload(auth?.user ?? {})
  }, [auth?.user])
  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const { showErrorMessage: showErrormessage } = useMessageError()

  const validations: Validation[] = [
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'unitName',
    },
  ]

  const { validate } = useValidation(validations)

  const createOnChange =
    (attributeName: keyof typeof payload) =>
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setPayload((prev: any) => ({
        ...prev,
        [attributeName]: evt.target.value,
      }))
    }

  const onSave = async () => {
    if (!validate()) return
    try {
      await UserService.update(auth!.user.id, {
        ...auth?.user,
        ...(payload as User),
        phone: cleanNumericInput(payload.phone),
        identification: cleanNumericInput(payload.identification),
      })
      showSuccessToast('Dados atualizados com sucesso.')
      setAuth((prev: any) => {
        prev.user = { ...prev.user, ...payload }
        return prev
      })
    } catch (error) {
      showErrormessage(
        error,
        'Não foi possível salvar os seus dados. Por favor, tente novamente.'
      )
    }
  }

  const changeScreenStatusToEdit = () => setScreenStatus(ScreenStatus.EDIT)
  const changeScreenStatusToVizualize = () =>
    setScreenStatus(ScreenStatus.VISUALIZE)

  const isPersonLegal = auth?.user.personType === PersonType.LEGAL
  const closeScreen = () => screen.close()
  return (
    <Container>
      <Row>
        <Bar>
          <ButtonGroup>
            <Button
              disabled={isScreenStatusVizualize}
              icon='floppy-disk'
              onClick={onSave}
              intent={Intent.SUCCESS}
            >
              Salvar
            </Button>
            <Button
              icon='edit'
              disabled={isScreenStatusEdit}
              onClick={changeScreenStatusToEdit}
            >
              Editar
            </Button>
            <Button
              icon='disable'
              disabled={isScreenStatusVizualize}
              onClick={changeScreenStatusToVizualize}
            >
              Cancelar
            </Button>
          </ButtonGroup>
          <Button icon='log-out' onClick={closeScreen}>
            Fechar
          </Button>
        </Bar>
      </Row>

      <Row>
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <InputText
            id={screen.id + 'user_name'}
            label='Nome:'
            value={payload?.name ?? ''}
            disabled={isScreenStatusVizualize}
            onChange={createOnChange('name')}
            required
          />

          <InputText
            id={screen.id + 'user_email'}
            label='Email'
            type='email'
            disabled={isScreenStatusVizualize}
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
            value={payload?.email ?? ''}
            onChange={createOnChange('email')}
          />

          <InputText
            id={screen.id + 'user_phone'}
            label='Telefone:'
            disabled={isScreenStatusVizualize}
            mask='(99) 99999-9999'
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
            value={payload?.phone ?? ''}
            onChange={createOnChange('phone')}
          />
          <InputText
            id={screen.id + 'user_identification'}
            label={isPersonLegal ? 'CNPJ' : 'CPF'}
            disabled={isScreenStatusVizualize}
            mask={isPersonLegal ? '99.999.999/9999-99' : '999.999.999-99'}
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
            value={payload?.identification ?? ''}
            onChange={createOnChange('identification')}
          />
        </Render>
      </Row>
    </Container>
  )
}

export default UnitsScreen
