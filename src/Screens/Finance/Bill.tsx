/* eslint-disable @typescript-eslint/no-unused-vars */
import { Intent } from '@blueprintjs/core'
import { useCallback, useMemo, useState } from 'react'
import { MdOutlinePayments } from 'react-icons/md'
import Button from '../../Components/Button'
import InputDate from '../../Components/InputDate'
import InputNumber from '../../Components/InputNumber'
import Bar from '../../Components/Layout/Bar'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import PaginatedTable from '../../Components/PaginatedTable'
import RegistrationButtonBar from '../../Components/RegistrationButtonBar'
import Render from '../../Components/Render'
import AsyncSelect from '../../Components/ScreenComponents/AsyncSelect'
import InputText from '../../Components/ScreenComponents/InputText'
import { BillStatuses, DateFormats, ScreenStatus } from '../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  StopLoadFunc,
} from '../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../Contracts/Components/ScreenProps'
import { Option } from '../../Contracts/Components/Suggest'
import { Column } from '../../Contracts/Components/Table'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Bill from '../../Contracts/Models/Bill'
import { useAlert } from '../../Hooks/useAlert'
import { useGrid } from '../../Hooks/useGrid'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import BillService from '../../Services/BillService'
import SupplierService from '../../Services/SupplierService'
import currencyFormat from '../../Util/currencyFormat'
import useMessageError from '../../Hooks/useMessageError'
import { endOfDay, startOfDay } from 'date-fns'

const BillsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const {
    payload,
    setPayload,
    screenStatus,
    setScreenStatus,
    changePayloadAttribute,
  } = useWindow<Bill>()
  const [selectedBills, setSelectedBills] = useState<Bill[]>([])

  const createValidation = (keyName: keyof Bill) => () =>
    Boolean((payload as any)[keyName])

  const validations: Validation[] = [
    {
      check: createValidation('reference'),
      errorMessage: 'O número da parcela é obrigatório',
      inputId: 'bill-reference',
    },
    {
      check: createValidation('name'),
      errorMessage: 'O nome da conta é obrigatório',
      inputId: 'bill-name',
    },
    {
      check: createValidation('value'),
      errorMessage: 'O valor da conta é obrigatório',
      inputId: 'bill-value',
    },
  ]

  const { validate } = useValidation(validations)

  const { setReloadGrid } = useGrid()
  const { showErrorToast, showSuccessToast } = useToast()
  const { openAlert } = useAlert()

  const isStatusVisualize = Boolean(screenStatus === ScreenStatus.VISUALIZE)

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

  const handleButtonCreateBillOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      await BillService.create({
        ...payload,
        value: +(payload.value as string)?.replace(',', '.'),
      })
      showSuccessToast({
        message: 'Conta cadastrada com sucesso',
        intent: Intent.SUCCESS,
      })

      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      increaseWindowSize?.()
    } catch (error: any) {
      showErrorMessage(
        error,
        'Não foi possível criar a conta. Por favor, tente novamente'
      )
    } finally {
      stopLoad()
    }
  }

  const handleButtonUpdateBillOnClick = async (stopLoad: StopLoadFunc) => {
    decreaseWindowSize?.()

    if (!validate()) {
      return
    }

    try {
      const response = await BillService.update(payload as Bill)

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
        return
      }

      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível atualizar o produto'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
      increaseWindowSize?.()
    }
  }

  const handleButtonDeleteBillOnClick = async (stopLoad: StopLoadFunc) => {
    try {
      await Promise.all(selectedBills.map((b) => BillService.delete(b.id)))
      showSuccessToast({
        message: 'Contas deletadas com sucesso',
        intent: Intent.SUCCESS,
      })
      setPayload({})
      setSelectedBills([])
      setReloadGrid(true)
    } catch (error: any) {
      const ErrorMessages = getErrorMessages(
        error.response?.data?.errors,
        'Não foi possível deletar a conta'
      )

      openAlert({
        text: ErrorMessages,
        intent: Intent.DANGER,
      })
    } finally {
      stopLoad()
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
    }
  }

  const columns = useMemo(
    () =>
      [
        {
          name: 'Nome',
          keyName: 'name',
          filters: [{ name: 'Nome da conta', type: 'text' }],
          style: {
            minWidth: '100%',
            width: '100%',
          },
        },
        {
          name: 'Fornecedor',
          formatText: (r) => r?.supplier?.name,
          filters: [
            { name: 'Fornecedor', type: 'text', keyName: 'supplier_name' },
          ],
          style: {
            minWidth: 200,
            width: 200,
          },
        },
        {
          name: 'Valor',
          filters: [{ name: 'Nome da conta', type: 'text', keyName: 'value' }],
          formatText: (r) => currencyFormat(r?.value),
          style: {
            minWidth: 100,
            width: 100,
          },
        },
        {
          name: 'Data de abertura',
          formatText: (r) =>
            new Date(r!.opening_date as string).toLocaleString(
              undefined,
              DateFormats.DATE_SHORT_TIME
            ),
          filters: [
            { name: 'Data da abertura', type: 'date', keyName: 'opening_date' },
          ],
          style: {
            minWidth: 150,
          },
        },
        {
          name: 'Data de vencimento',
          formatText: (r) =>
            new Date(r!.due_date as string).toLocaleString(
              undefined,
              DateFormats.DATE_SHORT_TIME
            ),
          filters: [
            { name: 'Data de vencimento', type: 'date', keyName: 'due_date' },
          ],
          style: {
            minWidth: 150,
          },
        },
        {
          name: 'Status',
          keyName: 'status_name',
          filters: [
            {
              name: 'Status',
              keyName: 'status',
              type: 'checkbox',
              value: [
                {
                  label: 'Em aberto',
                  value: BillStatuses.OPENED,
                },
                {
                  label: 'Expirado',
                  value: BillStatuses.EXPIRED,
                },
                {
                  label: 'Pago',
                  value: BillStatuses.PAID,
                },
              ],
            },
          ],
          style: {
            width: '100%',
          },
        },
      ] as Column<Bill>[],
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
    const referenceInput = document.getElementById('billName')
    referenceInput?.focus()
  }

  const handleVisualizeButtonOnClick = () => {
    setScreenStatus(ScreenStatus.SEE_REGISTERS)

    increaseWindowSize?.()
  }

  const handleButtonNewOnClick = () => {
    setPayload({
      opening_date: startOfDay(new Date()),
      due_date: endOfDay(new Date()),
    })
    setScreenStatus(ScreenStatus.NEW)
    decreaseWindowSize?.()
  }

  const registrationButtonBarProps: RegistrationButtonBarProps = {
    screen,
    handleNewButtonOnClick: handleButtonNewOnClick,
    handleSaveButtonOnClick:
      screenStatus === ScreenStatus.NEW
        ? handleButtonCreateBillOnClick
        : handleButtonUpdateBillOnClick,

    handleEditButtonOnClick: () => {
      const bill = selectedBills[0]
      setPayload({
        ...bill,
        due_date: new Date(bill.due_date!),
        opening_date: new Date(bill.opening_date!),
      })
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },
    handleDeleteButtonOnClick: (stopLoad: StopLoadFunc) => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: () => handleButtonDeleteBillOnClick(stopLoad),
        onCancel: stopLoad,
        cancelButtonText: 'Cancelar',
      })
    },
    handleButtonVisualizeOnClick: handleVisualizeButtonOnClick,
    handleCancelButtonOnClick: () => {
      increaseWindowSize?.()
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
    },
    buttonNewProps: {
      disabled: selectedBills.length > 0,
    },
    buttonDeleteProps: {
      disabled: false,
    },
    buttonEditProps: {
      disabled: selectedBills.length > 1,
    },
  }

  const onRowSelect = useCallback((row: Bill) => {
    setSelectedBills((prev) => {
      if (prev.some((bill) => bill.id === row.id)) {
        return prev.filter((bill) => bill.id !== row.id)
      }
      return [...prev, row]
    })
  }, [])

  const supplierFunction = useCallback(
    async (q: string | null): Promise<Option<any>[]> => {
      const response = await SupplierService.getAll(1, 20, {
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
      <Row>
        <Bar className='mt-1'>
          <Button
            icon={<MdOutlinePayments size={14} />}
            intent={Intent.PRIMARY}
            disabled={selectedBills.length === 0}
          >
            Pagar conta{selectedBills.length > 1 && 's'}
          </Button>
          <Render renderIf={selectedBills.length > 0}>
            <Button
              icon='clean'
              intent={Intent.DANGER}
              onClick={() => {
                setSelectedBills([])
              }}
            >
              Limpar seleção
            </Button>
          </Render>
        </Bar>
      </Row>

      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <AsyncSelect<Bill>
            name='supplier_id'
            label='Fornecedor'
            searchFunction={supplierFunction}
            buttonWidth='100%'
            fill
            buttonProps={{ style: { width: '100%' } }}
          />
        </Row>
        <Row>
          <InputText<Bill>
            name='reference'
            id='bill-reference'
            label='Referência:'
            disabled={isStatusVisualize}
            maxLength={15}
            required
            width='100%'
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
          />
          <InputText<Bill>
            name='name'
            id='bill-name'
            label='Nome:'
            disabled={isStatusVisualize}
            maxLength={100}
            required
            width='100%'
            style={{ flex: 1 }}
            inputStyle={{ width: '100%' }}
          />
          <InputNumber
            label='Valor'
            required
            id='bill-value'
            value={payload.value}
            intlConfig={{
              locale: 'pt-BR',
              currency: 'BRL',
            }}
            min={0}
            inputStyle={{ width: 'calc(100% - 34px)' }}
            onValueChange={(value) => changePayloadAttribute('value', value)}
            style={{ flex: 1 }}
          />
        </Row>
        <Row>
          <InputDate
            id='billDescription'
            label='Abertura da cobrança:'
            disabled={isStatusVisualize}
            timePrecision='minute'
            value={payload?.opening_date as Date}
            onChange={(d) => changePayloadAttribute('opening_date', d)}
            formatDate={(d) =>
              d.toLocaleString(undefined, DateFormats.DATE_SHORT_TIME)
            }
            fill
            closeOnSelection={false}
            style={{
              flex: 1,
            }}
          />
          <InputDate
            fill
            id='billDescription'
            label='Vencimento da cobrança:'
            disabled={isStatusVisualize}
            value={payload?.due_date as Date}
            timePrecision='minute'
            closeOnSelection={false}
            formatDate={(d) =>
              d.toLocaleString(undefined, DateFormats.DATE_SHORT_TIME)
            }
            style={{
              flex: 1,
            }}
            onChange={(d) => changePayloadAttribute('due_date', d)}
          />
        </Row>
      </Render>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row style={{ height: 'calc(100% - 45px)' }}>
          <PaginatedTable<Bill>
            height='100%'
            onRowSelect={onRowSelect}
            request={BillService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={(row) =>
              selectedBills.some((bill) => bill.id === row.id)
            }
            downloadable
            reportRequestOptions={[
              {
                mimeType: 'text/csv',
                reportType: 'csv',
                name: 'contas',
                responseType: 'text',
              },
            ]}
          />
        </Row>
      </Render>
    </Container>
  )
}

export default BillsScreen
