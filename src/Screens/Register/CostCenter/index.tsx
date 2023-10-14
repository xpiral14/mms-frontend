import React, { useCallback, useMemo } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import CostCenterService from '../../../Services/CostCenterService'
import ScreenProps from '../../../Contracts/Components/ScreenProps'
import {
  RegistrationButtonBarProps,
  StopLoadFunc,
} from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useGrid } from '../../../Hooks/useGrid'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { Intent } from '@blueprintjs/core'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import CostCenter from '../../../Contracts/Models/CostCenter'
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'
import { Column } from '../../../Contracts/Components/Table'
import AsyncSelect from '../../../Components/ScreenComponents/AsyncSelect'
import { Option } from '../../../Contracts/Components/Suggest'
import useMessageError from '../../../Hooks/useMessageError'

const CostCentersScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const { payload, setPayload, screenStatus, setScreenStatus } =
    useWindow<CostCenter>()

  const createValidation = (keyName: any) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('name'),
      errorMessage: 'O nome é obrigatório',
      inputId: 'costCenterName',
    },
  ]

  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showErrorToast, showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const isStatusVizualize = () =>
    Boolean(screenStatus === ScreenStatus.VISUALIZE)

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
  const { showErrorMessage } = useMessageError()
  const handleButtonCreateCostCenterOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      await CostCenterService.create(payload as CostCenter)

      showSuccessToast({
        message: 'Unidade cadastrada com sucesso',
        intent: Intent.SUCCESS,
      })

      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      increaseWindowSize?.()
    } catch (error) {
      showErrorMessage(error, 'Não foi possível cadastrar o centro de custo')
    } finally {
      stopLoad()
    }
  }

  const handleButtonUpdateCostCenterOnClick = async (
    stopLoad: StopLoadFunc
  ) => {
    decreaseWindowSize?.()

    if (!validate()) {
      return
    }

    try {
      const response = await CostCenterService.update(payload as CostCenter)

      if (response.status) {
        showSuccessToast({
          message: 'Produto atualizada com sucesso',
          intent: Intent.SUCCESS,
        })

        setReloadGrid(true)
      }

      if (!response) {
        openAlert({
          text: 'Não foi possível atualizar o produto',
          intent: Intent.DANGER,
        })
      }
      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      increaseWindowSize?.()
    } catch (error: any) {
      showErrorMessage(error, 'Não foi possível atualizar o produto')
    } finally {
      stopLoad()
    }
  }

  const handleButtonDeleteCostCenterOnClick = async () => {
    try {
      const response = await CostCenterService.delete(payload.id as number)

      if (response.status) {
        showSuccessToast({
          message: 'Item deletado com sucesso',
          intent: Intent.SUCCESS,
        })

        setPayload({})

        setReloadGrid(true)
      }

      if (!response) {
        showErrorToast({
          message: 'Não foi possível deletar o item selecionado',
          intent: Intent.DANGER,
        })
      }
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível deletar a unidade'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
    }
  }

  const columns = useMemo(
    () =>
      [
        {
          name: 'Nome',
          sortable: true,
          keyName: 'name',
          filters: [{ name: 'Nome do centro de custo', type: 'text' }],
        },
        {
          name: 'Centro de custo pai',
          sortable: true,
          keyName: 'parent_name',
          filters: [{ name: 'Nome do centro de custo', type: 'text' }],
        },
        {
          name: 'Descrição',
          keyName: 'description',
          filters: [{ name: 'Descrição do centro de custo', type: 'text' }],
        },
      ] as Column<CostCenter>[],
    []
  )

  const containerProps = useMemo(
    () => ({
      style: {
        flex: 1,
      },
    }),
    []
  )

  const increaseWindowSize = screen.increaseScreenSize

  const decreaseWindowSize = screen.decreaseScreenSize

  const focusNameInput = () => {
    const referenceInput = document.getElementById('costCenterName')
    referenceInput?.focus()
  }

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)

    increaseWindowSize?.()
  }

  const handleButtonNewOnClick = () => {
    setPayload({})
    setScreenStatus(ScreenStatus.NEW)
    focusNameInput()
    decreaseWindowSize?.()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateCostCenterOnClick
        : handleButtonUpdateCostCenterOnClick,

    handleEditButtonOnClick: () => {
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },
    handleDeleteButtonOnClick: () => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: handleButtonDeleteCostCenterOnClick,
        cancelButtonText: 'Cancelar',
      })
    },
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
    handleCancelButtonOnClick: () => {
      if (screenStatus === ScreenStatus.EDIT) {
        increaseWindowSize?.()
        setScreenStatus(ScreenStatus.SEE_REGISTERS)
        return
      }

      setScreenStatus(ScreenStatus.VISUALIZE)
    },
  }

  const createOnChange =
    (attributeName: string) => (evt: React.ChangeEvent<HTMLInputElement>) => {
      setPayload((prev: any) => ({
        ...prev,
        [attributeName]: evt.target.value || undefined,
      }))
    }

  const onRowSelect = useCallback(
    (row: { [key: string]: any }) => setPayload(row),
    []
  )

  const costCenterFunction = useCallback(
    async (q: string | null): Promise<Option[]> => {
      const response = await CostCenterService.getAll(1, 20, {
        name_like: q,
      })
      const options = response.data.data.map((supplier) => ({
        label: supplier.name,
        value: supplier.id,
      }))
      return options as Option[]
    },
    []
  )

  return (
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>

      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <InputText
            id='costCenterName'
            label='Nome:'
            value={payload?.name || ''}
            disabled={isStatusVizualize()}
            onChange={createOnChange('name')}
            maxLength={15}
            required
          />

          <InputText
            id='costCenterDescription'
            label='Descrição:'
            disabled={isStatusVizualize()}
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
            value={payload?.description || ''}
            onChange={createOnChange('description')}
            maxLength={120}
          />
        </Row>
        <Row>
          <AsyncSelect
            fill
            name='parent_id'
            buttonWidth='100%'
            searchFunction={costCenterFunction}
          />
        </Row>
      </Render>

      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='h-full'>
          <PaginatedTable<CostCenter>
            height='100%'
            onRowSelect={onRowSelect}
            request={CostCenterService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) => row.id === payload?.id}
            downloadable
            reportRequestOptions={[
              {
                mimeType: 'text/csv',
                reportType: 'csv',
                name: 'unidades',
                responseType: 'text',
              },
            ]}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default CostCentersScreen
