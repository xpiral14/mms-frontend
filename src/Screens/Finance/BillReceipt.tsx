import { ButtonGroup, Card, Colors, Intent } from '@blueprintjs/core'
import { CSSProperties, useCallback, useMemo, useState } from 'react'
import { MdOutlinePayments } from 'react-icons/md'
import Button from '../../Components/Button'
import InputDate from '../../Components/InputDate'
import InputNumber from '../../Components/InputNumber'
import Bar from '../../Components/Layout/Bar'
import Container from '../../Components/Layout/Container'
import Row from '../../Components/Layout/Row'
import {Row as TableRowProps} from '../../Contracts/Components/PaginatadeTable'
import PaginatedTable from '../../Components/PaginatedTable'
import RegistrationButtonBar from '../../Components/RegistrationButtonBar'
import Render from '../../Components/Render'
import AsyncSelect from '../../Components/ScreenComponents/AsyncSelect'
import InputText from '../../Components/ScreenComponents/InputText'
import { BillReceiptStatuses, DateFormats, ScreenStatus } from '../../Constants/Enums'
import {
  RegistrationButtonBarProps,
  StopLoadFunc,
} from '../../Contracts/Components/RegistrationButtonBarProps'
import ScreenProps from '../../Contracts/Components/ScreenProps'
import { Option } from '../../Contracts/Components/Suggest'
import { Column, Row as RowType } from '../../Contracts/Components/Table'
import { Validation } from '../../Contracts/Hooks/useValidation'
import BillReceipt from '../../Contracts/Models/BillReceipt'
import { useAlert } from '../../Hooks/useAlert'
import { useGrid } from '../../Hooks/useGrid'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import BillReceiptService from '../../Services/BillReceiptService'
import SupplierService from '../../Services/SupplierService'
import currencyFormat from '../../Util/currencyFormat'
import useMessageError from '../../Hooks/useMessageError'
import {
  addYears,
  endOfDay,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { useScreen } from '../../Hooks/useScreen'
import { billReceiptReception } from './BillReceiptReception'
import useAsync from '../../Hooks/useAsync'
import strToNumber from '../../Util/strToNumber'
import CostCenterService from '../../Services/CostCenterService'

type BillReceiptPayloadCreate = Omit<BillReceipt, 'due_date' | 'opening_date'> & {
  installments?: number
  due_date?: Date
  opening_date?: Date
}

const BillReceiptsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const {
    payload,
    setPayload,
    screenStatus,
    setScreenStatus,
    changePayloadAttribute,
  } = useWindow<BillReceiptPayloadCreate>()
  const [monthSummary, setMonthSummary] = useState<{
    opened: string
    received: string
    expired: string
  }>({
    opened: currencyFormat(0),
    received: currencyFormat(0),
    expired: currencyFormat(0),
  })
  const { showErrorMessage } = useMessageError()

  const [, reloadSummary] = useAsync(async () => {
    try {
      const summary = (
        await BillReceiptService.getMonthSummary(
          startOfMonth(new Date()).toISOString().slice(0, 10)
        )
      ).data.data
      setMonthSummary({
        expired: currencyFormat(
          (summary.expired ?? 0) + (summary?.partially_paid_expired ?? 0)
        ),
        received: currencyFormat(
          (summary.received ?? 0) + (summary?.partially_paid ?? 0)
        ),
        opened: currencyFormat(summary.opened ?? 0),
      })
    } catch (error) {
      showErrorMessage(error, 'Não foi possível obter o resumo do mês.')
    }
  }, [])

  const { openSubScreen } = useScreen()
  const [selectedBillReceipts, setSelectedBillReceipts] = useState<BillReceiptPayloadCreate[]>([])

  const createValidation = (keyName: keyof BillReceipt) => () =>
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
  const {  showSuccessToast } = useToast()
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

  const handleButtonCreateBillReceiptOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      await BillReceiptService.create({
        ...payload,
        value: +(payload.value as string)?.replace(',', '.'),
        due_date: payload.due_date?.toISOString(),
        opening_date: payload.due_date?.toISOString(),
      })
      showSuccessToast({
        message: 'Conta cadastrada com sucesso',
        intent: Intent.SUCCESS,
      })

      setPayload({})
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      increaseWindowSize?.()
      reloadSummary()
    } catch (error: any) {
      showErrorMessage(
        error,
        'Não foi possível criar a conta. Por favor, tente novamente'
      )
    } finally {
      stopLoad()
    }
  }

  const handleButtonUpdateBillReceiptOnClick = async (stopLoad: StopLoadFunc) => {
    decreaseWindowSize?.()

    if (!validate()) {
      return
    }

    try {
      const response = await BillReceiptService.update({
        ...payload,
        value: strToNumber(payload.value),
      } as BillReceipt)

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
      reloadSummary()
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

  const handleButtonDeleteBillReceiptOnClick = async (stopLoad: StopLoadFunc) => {
    try {
      await Promise.all(selectedBillReceipts.map((b) => BillReceiptService.delete(b.id)))
      showSuccessToast({
        message: 'Contas deletadas com sucesso',
        intent: Intent.SUCCESS,
      })
      setPayload({})
      setSelectedBillReceipts([])
      reloadSummary()
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
          name: 'Referência',
          sortable: true,
          keyName: 'reference',
          filters: [{ name: 'Referência', type: 'text' }],
          style: {
            minWidth: 100,
            width: 100,
          },
        },
        {
          name: 'Nome',
          keyName: 'name',
          sortable: true,
          filters: [{ name: 'Nome da conta', type: 'text' }],
          style: {
            minWidth: '100%',
            width: '100%',
          },
        },
        {
          name: 'Fornecedora',
          sortable: true,
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
          sortable: true,
          filters: [
            { name: 'Valor da conta', type: 'currency', keyName: 'value' },
          ],
          formatText: (r) => currencyFormat(r?.value),
          style: {
            minWidth: 100,
            width: 100,
          },
        },
        {
          name: 'Data de abertura',
          keyName: 'opening_date',
          sortable: true,
          formatText: (r) =>
            new Date(r!.opening_date as string).toLocaleString(
              undefined,
              DateFormats.DATE_SHORT_TIME
            ),
          filters: [
            {
              name: 'Data da abertura (inicio)',
              type: 'from_date',
              keyName: 'opening_date',
            },
            {
              name: 'Data de vencimento (fim)',
              type: 'to_date',
              keyName: 'opening_date',
            },
          ],
          style: {
            minWidth: 200,
          },
        },
        {
          name: 'Data de vencimento',
          sortable: true,
          formatText: (r) =>
            new Date(r!.due_date as string).toLocaleString(
              undefined,
              DateFormats.DATE_SHORT_TIME
            ),
          filters: [
            {
              name: 'Data de vencimento (inicio)',
              type: 'from_date',
              keyName: 'due_date',
            },
            {
              name: 'Data de vencimento (fim)',
              type: 'to_date',
              keyName: 'due_date',
            },
          ],
          style: {
            minWidth: 200,
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
                  value: BillReceiptStatuses.OPENED,
                },
                {
                  label: 'Expirado',
                  value: BillReceiptStatuses.EXPIRED,
                },
                {
                  label: 'Recebido',
                  value: BillReceiptStatuses.RECEIVED,
                },
              ],
            },
          ],
          style: {
            minWidth: 150,
          },
        },
      ] as Column<BillReceipt>[],
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
        ? handleButtonCreateBillReceiptOnClick
        : handleButtonUpdateBillReceiptOnClick,

    handleEditButtonOnClick: () => {
      const bill = selectedBillReceipts[0]
      setPayload({
        ...bill,
      })
      setScreenStatus(ScreenStatus.EDIT)
      decreaseWindowSize?.()
      focusNameInput()
    },
    handleDeleteButtonOnClick: (stopLoad: StopLoadFunc) => {
      openAlert({
        text: 'Deletar o item selecionado?',
        intent: Intent.DANGER,
        onConfirm: () => handleButtonDeleteBillReceiptOnClick(stopLoad),
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
      disabled: selectedBillReceipts.length > 0,
    },
    buttonDeleteProps: {
      disabled: selectedBillReceipts.length === 0,
    },
    buttonEditProps: {
      disabled: selectedBillReceipts.length != 1,
    },
    reports: [
      {
        text: 'Total de contas a receber por fornecedor',
        columns: [
          {
            name: 'Nome do fornecedor',
            keyName: 'supplier_name',
            filters: [{ name: 'Nome do fornecedor', type: 'text' }],
          },
          {
            name: 'CNPJ',
            keyName: 'supplier_identification',
            filters: [{ name: 'CNPJ', type: 'text' }],
          },
          {
            name: 'total',
            formatText: (r) => currencyFormat(+r.total ?? 0),
          },
        ],
        request: BillReceiptService.getTotalBillReceiptsBySuppliers,
        downloadable: true,
        reportRequestOptions: [
          { mimeType: 'text/csv', reportType: 'csv', responseType: 'text' },
        ],
      },
      {
        text: 'Histórico de pagamentos',
        columns: [
          {
            name: 'Referência',
            keyName: 'reference',
            sortable: true,
          },
          {
            name: 'Nome da conta',
            keyName: 'name',
            sortable: true,
          },
          {
            name: 'Data do pagamento',
            keyName: 'transaction_created_at',
            formatText: (c) =>
              new Date(c.transaction_created_at).toLocaleDateString(
                undefined,
                DateFormats.DATE_LONG_TIME
              ),
            sortable: true,
          },
          {
            name: 'Status da conta',
            keyName: 'status_name',
          },
          {
            name: 'Valor da conta',
            keyName: 'value',
            sortable: true,
            formatText: (c) => currencyFormat(c.value ?? 0),
          },
        ],
        downloadable: true,
        request: BillReceiptService.getBillReceiptsPaymentsHistory,
        reportRequestOptions: [
          {
            mimeType: 'text/csv',
            reportType: 'csv',
            name: 'historico-de-pagamentos',
          },
        ],
      },
    ],
  }

  const onRowSelect = useCallback((row: TableRowProps<BillReceipt>) => {
    setSelectedBillReceipts((prev) => {
      if (prev.some((bill) => bill.id === row.id)) {
        return prev.filter((bill) => bill.id !== row.id)
      }
      return [
        ...prev,
        {
          ...row,
          due_date: new Date(row.due_date as string),
          opening_date: new Date(row.opening_date as string),
        },
      ]
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
  const rowClassNames = (r: RowType<BillReceipt>): 'text-white' | undefined =>
    r.status != 'opened' ? 'text-white' : undefined
  const rowKey = (r: BillReceipt) => r.id
  const isSelected = (
    row: TableRowProps<BillReceipt>
  ): boolean => selectedBillReceipts.some((bill) => bill.id === row.id)
  const onClickReceiveBill = () => {
    openSubScreen<billReceiptReception>(
      {
        id: 'bill-receipt-reception',
      },
      screen.id,
      {
        billReceipts: selectedBillReceipts as any,
        onPay: () => {
          setSelectedBillReceipts([])
          reloadSummary()
          setReloadGrid(true)
        },
      }
    )
  }
  return (
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar {...registrationButtonBarProps} />
      </Row>
      <Row>
        <Bar className='mt-1 justify-between'>
          <ButtonGroup>
            <Button
              icon={<MdOutlinePayments size={14} />}
              intent={Intent.PRIMARY}
              disabled={
                selectedBillReceipts.length === 0 ||
                selectedBillReceipts.some((b) => b.status === BillReceiptStatuses.RECEIVED)
              }
              className='font-bold'
              onClick={onClickReceiveBill}
            >
              Receber conta{selectedBillReceipts.length > 1 && 's'}
            </Button>
            <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
              <Button
                icon='clean'
                intent={Intent.DANGER}
                disabled={selectedBillReceipts.length === 0}
                onClick={() => {
                  setSelectedBillReceipts([])
                }}
              >
                Limpar seleção
              </Button>
            </Render>
          </ButtonGroup>
          <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
            <div>
              <Row>
                <Card
                  className='px-3 py-2 text-xs font-bold text-white'
                  style={{ backgroundColor: Colors.RED3 }}
                >
                  Contas vencidas: {monthSummary?.expired}
                </Card>
                <Card
                  className='px-3 py-2 text-xs font-bold text-white'
                  style={{ backgroundColor: Colors.ORANGE3 }}
                >
                  Contas pendentes: {monthSummary?.opened}
                </Card>
                <Card
                  className='px-3 py-2 text-xs font-bold text-white'
                  style={{ backgroundColor: Colors.GREEN3 }}
                >
                  Contas recebidas: {monthSummary?.received}
                </Card>
              </Row>
            </div>
          </Render>
        </Bar>
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <AsyncSelect<BillReceipt>
            name='supplier_id'
            id='bill-supplier-id'
            fill
            label='Fornecedor'
            required
            searchFunction={supplierFunction}
            buttonWidth='49%'
          />
          <AsyncSelect<BillReceipt>
            fill
            label='Centro de custo'
            name='cost_center_id'
            buttonWidth='50%'
            searchFunction={costCenterFunction}
          />
        </Row>
        <Row>
          <InputText<BillReceipt>
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
          <InputText<BillReceipt>
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
            format='currency'
            min={0}
            inputStyle={{ width: 'calc(100% - 34px)' }}
            onValueChange={(value) => changePayloadAttribute('value', value)}
            style={{ flex: 1 }}
          />
        </Row>
        <Row>
          <InputDate
            id='bill-opening-date'
            label='Abertura da cobrança:'
            timePrecision='minute'
            value={payload?.opening_date}
            onChange={(d) => changePayloadAttribute('opening_date', d)}
            fill
            style={{ flex: 1 }}
            closeOnSelection={false}
            maxDate={addYears(new Date(), 5)}
          />
          <InputDate
            fill
            id='bill-due-date'
            label='Vencimento da cobrança:'
            value={payload?.due_date}
            timePrecision='minute'
            closeOnSelection={false}
            formatDate={(d) =>
              d.toLocaleString(undefined, DateFormats.DATE_SHORT_TIME)
            }
            style={{ flex: 1 }}
            onChange={(d) => changePayloadAttribute('due_date', d)}
            maxDate={addYears(new Date(), 5)}
          />

          <Render renderIf={!payload.id}>
            <InputNumber
              label='Parcelas'
              required
              id='bill-installments'
              value={payload.installments}
              min={0}
              inputStyle={{ width: 'calc(100% - 34px)' }}
              onValueChange={(value) =>
                changePayloadAttribute('installments', value)
              }
              style={{ flex: 1 }}
            />
          </Render>
        </Row>
      </Render>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row style={{ height: 'calc(100% - 45px)' }}>
          <PaginatedTable<BillReceipt>
            height='100%'
            onRowSelect={onRowSelect}
            request={BillReceiptService.getAll}
            containerProps={containerProps}
            columns={columns}
            isSelected={isSelected}
            stripped={false}
            downloadable
            reportRequestOptions={[
              {
                mimeType: 'text/csv',
                reportType: 'csv',
                name: 'contas',
                responseType: 'text',
              },
            ]}
            rowKey={rowKey}
            rowStyle={getRowStyle}
            rowClassNames={rowClassNames}
          />
        </Row>
      </Render>
    </Container>
  )
}

function getRowStyle(row: RowType<BillReceipt>): CSSProperties {
  switch (row.status) {
  case BillReceiptStatuses.RECEIVED:
    return {
      backgroundColor: Colors.GREEN3,
      color: `${Colors.WHITE}`,
    }
  case BillReceiptStatuses.EXPIRED:
    return {
      backgroundColor: Colors.RED3,
      color: 'white',
    }
  case BillReceiptStatuses.OPENED:
  default:
    return {
      backgroundColor: Colors.ORANGE3,
      color: 'white',
    }
  }
}
export default BillReceiptsScreen
