import { Intent } from '@blueprintjs/core'
import React, { useEffect } from 'react'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import RadioGroup from '../../../Components/RadioGroup'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import { PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Customer from '../../../Contracts/Models/Customer'
import { CustomerRegisterScreenProps } from '../../../Contracts/Screen/Register/Customer'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import useMessageError from '../../../Hooks/useMessageError'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import CustomerService from '../../../Services/CustomerService'
import cleanNumericInput from '../../../Util/cleanNumericInput'
import formatIdentification from '../../../Util/formatIdentification'
import formatPhone from '../../../Util/formatPhone'
import Render from '../../../Components/Render'
import Row from '../../../Components/Layout/Row'
import Container from '../../../Components/Layout/Container'

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

const CustomerRegister: React.FC<CustomerRegisterScreenProps> = ({
  screen,
  defaultCustomer,
  defaultScreenStatus,
}) => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Customer>()

  useEffect(() => {
    if (defaultCustomer) {
      setPayload(defaultCustomer)
    }
    if (defaultScreenStatus) {
      setScreenStatus(defaultScreenStatus)
    }
  }, [])

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: () => {
        const cleaned = cleanNumericInput(payload.identification)

        return (
          !payload.personType ||
          cleaned?.length === 11 ||
          cleaned?.length === 14
        )
      },
      errorMessage: 'CPF ou CNPJ inválido',
      inputId: String(PersonType.PHYSICAL),
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'name',
    },
    {
      check: () =>
        !payload?.phone || cleanNumericInput(payload?.phone).length === 11,
      errorMessage: 'O telefone apresenta um padrão incorreto',
      inputId: 'customer-register-phone',
    },
  ]
  const { validate } = useValidation(validations)
  const { setReloadGrid } = useGrid()
  const { showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const isStatusVizualize = () => screenStatus === ScreenStatus.VISUALIZE
  const {showErrorMessage: showErrormessage} = useMessageError()

  const createCustomer = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const createPayload = {
        ...payload,
        identification: cleanNumericInput(payload?.identification ?? ''),
        phone: cleanNumericInput(payload?.phone ?? ''),
      }
      const response = await CustomerService.create(createPayload)
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
      showErrormessage(
        error,
        'Não foi possível criar o cliente'
      )
    } finally {
      stopLoad()
    }
  }

  const saveCustomer = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }
    try {
      const requestPayload = {
        ...payload,
        identification: cleanNumericInput(payload?.identification ?? ''),
        phone: cleanNumericInput(payload?.phone ?? ''),
      }

      if (!validate()) {
        return
      }
      const response = await CustomerService.edit(requestPayload)
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
      showErrormessage(
        error,
        'Não foi possível atualizar o cliente'
      )

    } finally {
      stopLoad()
    }
  }

  const deleteCustomer = () => {
    const onConfirm = async () => {
      try {
        await CustomerService.delete(payload?.id as number)
        setReloadGrid(true)
        setScreenStatus(ScreenStatus.VISUALIZE)
        setPayload({})
      } catch (error: any) {
        showErrormessage(
          error,
          'Não foi possível criar o cliente'
        )
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
      screenStatus === ScreenStatus.NEW ? createCustomer : saveCustomer,
    handleDeleteButtonOnClick: deleteCustomer,
  }

  const createOnChange =
    (attributeName: string) => (evt: any) => {
      setPayload((prev: any) => ({
        ...prev,
        [attributeName]: evt.target.value,
      }))
    }

  return (
    <Container style={{height: 'calc(100% - 40px)'}}>
      <Row>
        <RegistrationButtonBar {...registratioButtonBarProps} />
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <RadioGroup
            id='personTypes'
            selectedValue={payload.personType}
            label='Tipo de pessoa'
            inline
            disabled={isStatusVizualize()}
            radios={personTypesOptions}
            onClick={(v) => {
              if (v !== payload.personType) return
              setPayload((prev) => ({
                ...prev,
                personType: undefined,
                identification: undefined,
              }))
            }}
            onChange={async (evt: any) => {
              evt.persist()
              setPayload((prev) => ({
                ...prev,
                identification: '',
                personType:
                    evt.target.value === prev.personType
                      ? null
                      : (evt.target.value as any),
              }))
            }}
          />
        </Row>
        <Row>
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
            id='customer-register-phone'
            required
            mask='(99) 99999-9999'
            label='Telefone'
            placeholder='Digite o Telefone do cliente'
            disabled={isStatusVizualize()}
            onChange={createOnChange('phone')}
          />
        </Row>
      </Render>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <PaginatedTable
          height='350px'
          isSelected={(row) => row.id === payload.id}
          columns={[
            {
              name: 'Nome',
              keyName: 'name',
              style: {
                width: '33%',
              },
            },
            {
              name: 'CPF ou CNPJ',
              // keyName: 'identification',
              formatText: (row) =>
                formatIdentification(row?.identification as string),
              style: {
                width: '33%',
              },
            },
            {
              name: 'Telefone',
              keyName: 'phone',
              formatText: (row) => formatPhone(row?.phone as string),
              style: {
                width: '33%',
              },
            },
            {
              name: 'Email',
              keyName: 'email',
            },
          ]}
          request={CustomerService.getAll as any}
          onRowSelect={(row) => {
            setScreenStatus(ScreenStatus.VISUALIZE)
            setPayload({
              ...row,
              personType:
                  row.identification?.length > 11
                    ? PersonType.LEGAL
                    : PersonType.PHYSICAL,
            })
          }}
        />
      </Render>
    </Container>
  )
}

export default CustomerRegister
