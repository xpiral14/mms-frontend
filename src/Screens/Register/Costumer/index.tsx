import { Intent } from '@blueprintjs/core'
import React, { useEffect } from 'react'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import RadioGroup from '../../../Components/RadioGroup'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import { PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Costumer from '../../../Contracts/Models/Costumer'
import { CostumerRegisterScreenProps } from '../../../Contracts/Screen/Register/Costumer'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import { Container, Header, Body, FormContainer, TableContainer } from './style'

const personTypesOptions = [
  {
    value: PersonType.PHYSICAL as string,
    label: 'Física',
    id: String(PersonType.PHYSICAL),
  },
  {
    value: PersonType.LEGAL as string,
    label: 'Jurídica',
    id: String(PersonType.LEGAL),
  },
]

const CostumerRegister: React.FC<CostumerRegisterScreenProps> = ({
  screen,
  defaultCostumer,
  defaultScreenStatus,
}) => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Costumer>()

  useEffect(() => {
    if (defaultCostumer) {
      setPayload(defaultCostumer)
    }
    if (defaultScreenStatus) {
      setScreenStatus(defaultScreenStatus)
    }
  }, [])

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('personType'),
      errorMessage: 'O tipo de pessoa é obrigatório',
      inputId:  String(PersonType.PHYSICAL),
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'name',
    },
    {
      check: createValidation('identification'),
      errorMessage: `O ${payload.personType === PersonType.LEGAL ? 'cpf' : 'cnpj'} é obrigatório`,
      inputId: 'name',
    },
    {
      check: createValidation('phone'),
      errorMessage: 'O telefone é obrigatório',
      inputId: 'costumer-register-phone',
    },
  ]
  const { validate } = useValidation(validations)
  const { setReloadGrid } = useGrid()
  const { showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const isStatusVizualize = () => screenStatus === ScreenStatus.VISUALIZE

  const getErrorMessages = (errors?: any[], defaultMessage?: string) => {
    const errorMessages = errors?.map((error) => ({
      message: error.message,
    })) || [{ message: defaultMessage }]

    return (
      <ul>
        {errorMessages?.map(({ message }) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    )
  }

  const createCostumer = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const createPayload = {
        ...payload,
        roleId: 1, // TODO change this after
        identification: payload.identification?.replace(/[^0-9]/g,  ''),
        phone: payload.phone?.replace(/[^0-9]/g, ''),
      }
      const response = await CostumerService.create(createPayload)
      if (response.status) {
        showSuccessToast({
          message: 'Cliente criado com sucesso',
          intent: Intent.SUCCESS,
        })
        setReloadGrid(true)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível criar o cliente',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível criar o cliente'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally{
      stopLoad()
    }
  }

  const saveCostumer = async (stopLoad: () => void) => {
    if(!validate()){
      stopLoad()
      return
    }
    try {
      payload.roleId = 1
      payload.identification = payload?.identification?.replace(/^[0-9]/g, '')
      const response = await CostumerService.edit(payload)
      if (response.status) {
        showSuccessToast({
          message: 'Cliente atualizado com sucesso',
          intent: Intent.SUCCESS,
        })
        setPayload({})
        setReloadGrid(true)
        setScreenStatus(ScreenStatus.VISUALIZE)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o cliente',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o cliente'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
    finally{
      stopLoad() 
    }
  }

  const deleteCostumer = () => {
    const onConfirm = async () => {
      try {
        await CostumerService.delete(payload?.id as number)
        setReloadGrid(true)
        setScreenStatus(ScreenStatus.VISUALIZE)
        setPayload({})
      } catch (error: any) {
        const ErrorMessages = getErrorMessages(
          error.response?.data?.errors,
          'Não foi possível criar o cliente'
        )

        openAlert({
          text: ErrorMessages,
          intent: Intent.DANGER,
        })
      }
    }
    openAlert({
      text: 'Tem certeza que deseja deletar o cliente?',
      intent: Intent.DANGER,
      confirmButtonText: `Deletar cliente ${payload?.name || ''}`,
      onConfirm,
    })
  }

  const registratioButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? createCostumer : saveCostumer,
    handleDeleteButtonOnClick: deleteCostumer,
  }

  const createOnChange =
    (attributeName: string) => (evt: React.FormEvent<HTMLInputElement>) => {
      setPayload((prev: any) => ({
        ...prev,
        [attributeName]: evt.currentTarget.value,
      }))
    }

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registratioButtonBarProps} />
      </Header>
      <Body>
        <FormContainer>
          <div>
            <RadioGroup
              id='personTypes'
              selectedValue={payload.personType}
              label='Tipo de pessoa'
              inline
              disabled={isStatusVizualize()}
              radios={personTypesOptions}
              onChange={(evt) =>
                setPayload((prev) => ({
                  ...prev,
                  identification: '',
                  personType: evt.currentTarget.value as any,
                }))
              }
            />
          </div>
          <div>
            {Boolean(payload.personType) &&
              (payload.personType === PersonType.PHYSICAL ? (
                <InputText
                  value={payload?.identification}
                  id='CPF'
                  mask='999.999.999-99'
                  label='CPF'
                  placeholder='Digite o email do cliente'
                  disabled={isStatusVizualize()}
                  onChange={createOnChange('identification')}
                />
              ) : (
                <InputText
                  value={payload.identification}
                  id='CNPJ'
                  mask='99.999.999/9999-99'
                  label='CNPJ'
                  placeholder='Digite o email do cliente'
                  disabled={isStatusVizualize()}
                  onChange={createOnChange('identification')}
                />
              ))}
            <InputText
              value={payload?.name || ''}
              id='name'
              label='Nome do cliente'
              placeholder='Digite o nome do cliente'
              disabled={isStatusVizualize()}
              onChange={createOnChange('name')}
              required
            />

            <InputText
              value={payload?.email || ''}
              id='Email'
              label='Email do cliente'
              placeholder='Digite o email do cliente'
              disabled={isStatusVizualize()}
              onChange={createOnChange('email')}
            />
            <InputText
              value={payload?.phone || ''}
              id='costumer-register-phone'
              required
              mask='(99) 99999-9999'
              label='Telefone'
              placeholder='Digite o Telefone do cliente'
              disabled={isStatusVizualize()}
              onChange={createOnChange('phone')}
            />
          </div>
        </FormContainer>

        <TableContainer>
          <PaginatedTable
            containerProps={{
              style: {
                overflowY: 'scrool',
                width: '100%',
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
                keyName: 'identification',
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
              setScreenStatus(ScreenStatus.VISUALIZE)
              setPayload(row)
            }}
          />
        </TableContainer>
      </Body>
    </Container>
  )
}

export default CostumerRegister
