import { Intent } from '@blueprintjs/core'
import React, { useCallback, useEffect } from 'react'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import RadioGroup from '../../../Components/RadioGroup'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import Render from '../../../Components/Render'
import { PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Employee from '../../../Contracts/Models/Employee'
import { EmployeeRegisterScreenProps } from '../../../Contracts/Screen/Register/Employee'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import EmployeeService from '../../../Services/EmployeeService'
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

const EmployeeRegister: React.FC<EmployeeRegisterScreenProps> = ({
  screen,
  defaultEmployee,
  defaultScreenStatus,
}) => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Employee>()

  useEffect(() => {
    if (defaultEmployee) {
      setPayload(defaultEmployee)
    }

    if (defaultScreenStatus) {
      setScreenStatus(defaultScreenStatus)
    }

    setPayload({
      personType: PersonType.PHYSICAL,
    })
  }, [])

  const filterDigits = (string: string) => string.replace(/[^0-9]/gi, '')

  const checkIdLength = (type: PersonType) => {
    if (!payload.personType || !payload.identification?.length) return true

    const id = filterDigits(payload.identification)

    return {
      [PersonType.PHYSICAL]: !(id?.length < 11),
      [PersonType.LEGAL]: !(id?.length < 14),
    }[type]
  }

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'name',
    },
    {
      check: createValidation('identification'),
      errorMessage: `O ${
        payload.personType === PersonType.PHYSICAL ? 'CPF' : 'CNPJ'
      } é obrigatório`,
      inputId: 'personTypes',
    },
    {
      check: () =>
        payload.personType === PersonType.LEGAL
          ? checkIdLength(PersonType.LEGAL)
          : true,
      errorMessage: 'O CNPJ deve contar no mínimo 14 dígitos.',
      inputId: 'personTypes',
    },
    {
      check: () =>
        payload.personType === PersonType.PHYSICAL
          ? checkIdLength(PersonType.PHYSICAL)
          : true,
      errorMessage: 'O CPF deve contar no mínimo 11 dígitos.',
      inputId: 'personTypes',
    },
    {
      check: createValidation('phone'),
      errorMessage: 'O telefone é obrigatório',
      inputId: 'employee-register-phone',
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

  const createEmployee = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      const createPayload = {
        ...payload,
        roleId: 1,
        identification: payload.identification?.replace(/[^0-9]/g, ''),
        phone: payload.phone?.replace(/[^0-9]/g, ''),
      }
      const response = await EmployeeService.create(createPayload)
      if (response.status) {
        showSuccessToast({
          message: 'Funcionário criado com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível criar o funcionário',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível criar o funcionário'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const saveEmployee = async (stopLoad: () => void) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      payload.roleId = 1
      payload.identification = payload?.identification?.replace(/^[0-9]/g, '')

      const response = await EmployeeService.edit(payload)

      if (response.status) {
        showSuccessToast({
          message: 'Funcionário atualizado com sucesso',
          intent: Intent.SUCCESS,
        })

        setPayload({
          personType: PersonType.PHYSICAL,
        })

        setReloadGrid(true)

        setScreenStatus(ScreenStatus.VISUALIZE)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o funcionário',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o funcionário'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
    }
  }

  const deleteEmployee = async () => {
    try {
      await EmployeeService.delete(payload?.id as number)
      setReloadGrid(true)

      setScreenStatus(ScreenStatus.VISUALIZE)

      setPayload({
        personType: PersonType.PHYSICAL,
      })
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível criar o funcionário'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const increaseWindowSize = screen.increaseScreenSize
  const decreaseWindowSize = screen.decreaseScreenSize

  const focusNameInput = () => {
    const referenceInput = document.getElementById('employee-name')
    referenceInput?.focus()
  }

  // This needs to be async, otherwise it won't work
  // The currentTarget used in the RadioGroup component on line 330-ish
  // only gets its value while the event lasts, then the setState function gets
  // called - which is asynchronous - and sets the value to null (currentTarget)
  const handleButtonNewOnClick = async () => {
    setPayload({
      personType: PersonType.PHYSICAL,
    })

    setScreenStatus(ScreenStatus.NEW)
    focusNameInput()
    decreaseWindowSize?.()
  }

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)

    increaseWindowSize?.()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? createEmployee : saveEmployee,
    handleEditButtonOnClick: () => {
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },

    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Tem certeza que deseja deletar o funcionário?',
        intent: Intent.DANGER,
        confirmButtonText: 'Deletar funcionário?',
        onConfirm: deleteEmployee,
      })
    },

    handleCancelButtonOnClick: () => {
      if (screenStatus === ScreenStatus.EDIT) {
        increaseWindowSize?.()
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        return
      }

      setScreenStatus(ScreenStatus.VISUALIZE)
    },

    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
  }

  const changePayload =
    (key: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      setPayload((prev: any) => ({
        ...prev,
        [key]: evt.target.value,
      }))
    }

  const tableColumns = [
    {
      name: 'Nome',
      keyName: 'name',
    },
    {
      name: 'Email',
      keyName: 'email',
    },
    {
      name: 'Telefone',
      keyName: 'phone',
    },
  ]

  const onRowSelect = useCallback(
    (row: { [key: string]: any }) => setPayload(row),
    []
  )

  return (
    <Container>
      <Header>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body>
        <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
          <FormContainer>
            <div>
              <RadioGroup
                id='personTypes'
                selectedValue={payload.personType}
                label='Tipo de pessoa'
                inline
                disabled={isStatusVizualize()}
                radios={personTypesOptions}
                onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                  evt.persist()

                  const value = evt.currentTarget.value

                  setPayload((prev) => ({
                    ...prev,
                    identification: '',
                    personType: value as any,
                  }))
                }}
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
                    placeholder='Digite o email do funcionário'
                    disabled={isStatusVizualize()}
                    onChange={changePayload('identification')}
                  />
                ) : (
                  <InputText
                    value={payload.identification}
                    id='CNPJ'
                    mask='99.999.999/9999-99'
                    label='CNPJ'
                    placeholder='Digite o email do funcionário'
                    disabled={isStatusVizualize()}
                    onChange={changePayload('identification')}
                  />
                ))}
              <InputText
                value={payload?.name || ''}
                id='employee-name'
                label='Nome'
                placeholder='Digite o nome'
                disabled={isStatusVizualize()}
                onChange={changePayload('name')}
                required
              />

              <InputText
                value={payload?.email || ''}
                id='Email'
                label='Email do funcionário'
                placeholder='Digite o email do funcionário'
                disabled={isStatusVizualize()}
                onChange={changePayload('email')}
              />
              <InputText
                value={payload?.phone || ''}
                id='employee-register-phone'
                required
                mask='(99) 99999-9999'
                label='Telefone'
                placeholder='Digite o Telefone do funcionário'
                disabled={isStatusVizualize()}
                onChange={changePayload('phone')}
              />
            </div>
          </FormContainer>
        </Render>

        <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
          <TableContainer style={{ height: '100%' }}>
            <PaginatedTable
              height='100%'
              isSelected={(row) => row.id === payload.id}
              columns={tableColumns}
              request={EmployeeService.getAll}
              onRowSelect={onRowSelect}
            />
          </TableContainer>
        </Render>
      </Body>
    </Container>
  )
}

export default EmployeeRegister
