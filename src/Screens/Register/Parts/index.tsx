import React from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import { Container, Header, Body } from './style'
import PaginatedTable from '../../../Components/PaginatedTable'
import PartsService from '../../../Services/PartsService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import { RegistrationButtonBarProps } from '../../../Contracts/Components/RegistrationButtonBarProps'
import useGrid from '../../../Hooks/useGrid'
import useWindow from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { Intent } from '@blueprintjs/core'
import useToast from '../../../Hooks/useToast'
import Piece from '../../../Contracts/Models/Piece'

const PartsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<Piece>()

  const { setReloadGrid } = useGrid()
  const { showErrorToast, showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  //const isStatusVizualize = () => screenStatus === ScreenStatus.VISUALIZE

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

  const createPart = async () => {
    try {
      const createPayload = {
        ...payload,
      }

      const response = await PartsService.create(createPayload)

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

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW ? createPart : savePart,
    handleDeleteButtonOnClick: deletePart,
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
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Header>

      <Body>
        <div>
          <form>
            <div className='flexRow'>
              <div style={{ width: '10%' }}>
                <InputText
                  id='partId'
                  label='Id:'
                  disabled={true}
                  itent='none'
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <InputText
                  id='partReference'
                  label='Referência:'
                  disabled={true}
                  itent='primary'
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ width: '90%' }}>
                <InputText
                  id='partName'
                  label='Nome:'
                  disabled={false}
                  itent='primary'
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className='flexRow'>
              <div style={{ width: '80%' }}>
                <InputText
                  id='partDescription'
                  label='Descrição:'
                  disabled={false}
                  itent='primary'
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ width: '20%' }}>
                <InputText
                  id='partPrice'
                  label='Preço:'
                  disabled={false}
                  placeholder='R$'
                  itent='primary'
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          </form>
        </div>

        <div className='tableRow'>
          <PaginatedTable
            request={PartsService.getAll}
            containerProps={{
              style: {
                height: '100%',
              },
            }}
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
          />
        </div>
      </Body>
    </Container>
  )
}

export default PartsScreen
