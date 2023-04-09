/* eslint-disable @typescript-eslint/no-unused-vars */
import { Intent } from '@blueprintjs/core'
import React, { useEffect } from 'react'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import { PersonType, ScreenStatus } from '../../../Constants/Enums'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Supplier from '../../../Contracts/Models/Supplier'
import { SupplierRegisterScreenProps } from '../../../Contracts/Screen/Register/Suppliers'
import { useAlert } from '../../../Hooks/useAlert'
import { useGrid } from '../../../Hooks/useGrid'
import useMessageError from '../../../Hooks/useMessageError'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { useWindow } from '../../../Hooks/useWindow'
import SupplierService from '../../../Services/SupplierService'
import cleanNumericInput from '../../../Util/cleanNumericInput'
import formatIdentification from '../../../Util/formatIdentification'
import formatPhone from '../../../Util/formatPhone'
import Render from '../../../Components/Render'
import Row from '../../../Components/Layout/Row'
import Container from '../../../Components/Layout/Container'
import Button from '../../../Components/Button'
import { useScreen } from '../../../Hooks/useScreen'

const SupplierRegister: React.FC<SupplierRegisterScreenProps> = ({
  screen,
  defaultSupplier,
  defaultScreenStatus,
}) => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Supplier>()

  useEffect(() => {
    if (defaultSupplier) {
      setPayload(defaultSupplier)
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

        return cleaned?.length === 14
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
      inputId: 'supplier-register-phone',
    },
  ]
  const { validate } = useValidation(validations)
  const { setReloadGrid } = useGrid()
  const { showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const { openSubScreen } = useScreen()

  const isStatusVizualize = () => screenStatus === ScreenStatus.VISUALIZE
  const { showErrorMessage: showErrormessage } = useMessageError()

  const createSupplier = async (stopLoad: () => void) => {
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
      const response = await SupplierService.create(createPayload)
      if (response.status) {
        showSuccessToast({
          message: 'Fornecedor criado com sucesso',
          intent: Intent.SUCCESS,
        })
        setReloadGrid(true)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível criar o fornecedor',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      showErrormessage(error, 'Não foi possível criar o fornecedor')
    } finally {
      stopLoad()
    }
  }

  const saveSupplier = async (stopLoad: () => void) => {
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
      const response = await SupplierService.edit(requestPayload)
      if (response.status) {
        showSuccessToast({
          message: 'Fornecedor atualizado com sucesso',
          intent: Intent.SUCCESS,
        })
        setPayload({})
        setReloadGrid(true)
        setScreenStatus(ScreenStatus.VISUALIZE)
      }
      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o fornecedor',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      showErrormessage(error, 'Não foi possível atualizar o fornecedor')
    } finally {
      stopLoad()
    }
  }

  const deleteSupplier = () => {
    const onConfirm = async () => {
      try {
        await SupplierService.delete(payload?.id as number)
        setReloadGrid(true)
        setScreenStatus(ScreenStatus.VISUALIZE)
        setPayload({})
      } catch (error: any) {
        showErrormessage(error, 'Não foi possível criar o fornecedor')
      }
    }
    openAlert({
      text: 'Tem certeza que deseja deletar o fornecedor?',
      intent: Intent.DANGER,
      confirmButtonText: `Deletar fornecedor ${payload?.name || ''}`,
      onConfirm,
    })
  }

  const registratioButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? createSupplier : saveSupplier,
    handleDeleteButtonOnClick: deleteSupplier,
  }

  const createOnChange = (attributeName: string) => (evt: any) => {
    setPayload((prev: any) => ({
      ...prev,
      [attributeName]: evt.target.value,
    }))
  }

  return (
    <Container style={{ height: 'calc(100% - 85px)' }}>
      <Row className='py-2'>
        <RegistrationButtonBar {...registratioButtonBarProps} />
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <InputText
            value={payload.identification}
            id='CNPJ'
            mask='99.999.999/9999-99'
            label='CNPJ'
            placeholder='Digite o email do fornecedor'
            disabled={isStatusVizualize()}
            onChange={createOnChange('identification')}
          />
          <InputText
            value={payload?.name || ''}
            id='name'
            label='Nome do fornecedor'
            placeholder='Digite o nome do fornecedor'
            disabled={isStatusVizualize()}
            onChange={createOnChange('name')}
            required
          />

          <InputText
            value={payload?.mail || ''}
            id='Email'
            label='Email do fornecedor'
            placeholder='Digite o email do fornecedor'
            disabled={isStatusVizualize()}
            onChange={createOnChange('email')}
          />
          <InputText
            value={payload?.phone || ''}
            id='supplier-register-phone'
            required
            mask='(99) 99999-9999'
            label='Telefone'
            placeholder='Digite o Telefone do fornecedor'
            disabled={isStatusVizualize()}
            onChange={createOnChange('phone')}
          />
        </Row>
      </Render>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row>
          <Button
            disabled={!payload.id}
            onClick={() => {
              openSubScreen(
                {
                  id: 'goods-register',
                  contentSize: '400 300',
                },
                screen.id,
                {
                  supplierId: payload.id
                }
              )
            }}
          >
          Adicionar registro de mercadoria
          </Button>
        </Row>
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
              keyName: 'mail',
            },
          ]}
          request={SupplierService.getAll as any}
          onRowSelect={(row) => {
            setPayload({
              ...row,
            })
          }}
        />
      </Render>
    </Container>
  )
}

export default SupplierRegister
