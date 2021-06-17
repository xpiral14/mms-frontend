/* eslint-disable @typescript-eslint/no-unused-vars */
import { Intent } from '@blueprintjs/core'
import React, { useEffect, useState } from 'react'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import RadioGroup from '../../../Components/RadioGroup'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import { PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import Costumer from '../../../Contracts/Models/Costumer'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import { useToast } from '../../../Hooks/useToast'
import { useWindow } from '../../../Hooks/useWindow'
import CostumerService from '../../../Services/CostumerService'
import { Container, Header, Body } from './style'

const personTypesOptions = [
  {
    value: PersonType.PHYSICAL,
    label: 'Física',
  },
  {
    value: PersonType.LEGAL,
    label: 'Jurídica',
  },
]

const CostumerRegister: React.FC<ScreenProps> = ({ screen }) => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Partial<Costumer>>()
  const { setReloadGrid } = useGrid()
  const { showErrorToast, showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const isStatusCreate = () => screenStatus === ScreenStatus.NEW
  const isStatusEdit = () => screenStatus === ScreenStatus.EDIT
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

  const createCostumer = async () => {
    try {
      const createPayload = {
        ...payload,
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
    } catch (error) {
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

  const saveCostumer = async () => {
    try {
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
    } catch (error) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o cliente'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    }
  }

  const deleteCostumer = () => {
    const onConfirm = async () => {
      try {
        const response = await CostumerService.delete(payload?.id as number)
        if (response.status) {
          showSuccessToast({
            message: 'Cliente criado com sucesso',
            intent: Intent.SUCCESS,
          })
          setReloadGrid(true)
          setScreenStatus(ScreenStatus.VISUALIZE)
          setPayload({})
        }
        if (!response) {
          openAlert({
            text: 'Não foi possível criar o cliente',
            intent: Intent.DANGER,
          })
        }
      } catch (error) {
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
        <div>
          <RadioGroup
            selectedValue={payload.personType}
            label='Tipo de pessoa'
            inline
            disabled={isStatusVizualize()}
            radios={personTypesOptions}
            onChange={(evt) =>
              setPayload((prev) => ({
                ...prev,
                cpf: '',
                cnpj: '',
                personType: evt.currentTarget.value as PersonType,
              }))
            }
          />
        </div>
        {console.log(payload.personType)}
        <div>
          {Boolean(payload.personType) &&
            (payload.personType === PersonType.PHYSICAL ? (
              <InputText
                value={payload?.cpf}
                id='CPF'
                mask='999.999.999-99'
                label='CPF'
                placeholder='Digite o email do cliente'
                disabled={isStatusVizualize()}
                onChange={createOnChange('cpf')}
              />
            ) : (
              <InputText
                value={payload.cnpj}
                id='CNPJ'
                mask='99.999.999/9999-99'
                label='CNPJ'
                placeholder='Digite o email do cliente'
                disabled={isStatusVizualize()}
                onChange={createOnChange('cnpj')}
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
            id='phone'
            mask='(99) 99999-9999'
            label='Telefone'
            placeholder='Digite o Telefone do cliente'
            disabled={isStatusVizualize()}
            onChange={createOnChange('phone')}
          />
        </div>
        <PaginatedTable
          containerProps={{
            style: {
              height: '300px',
              maxHeight: '100px',
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
            setScreenStatus(ScreenStatus.VISUALIZE)
            setPayload(row)
          }}
        />
      </Body>
    </Container>
  )
}

export default CostumerRegister
