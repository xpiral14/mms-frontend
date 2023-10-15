/* eslint-disable @typescript-eslint/no-unused-vars */
import { ButtonGroup, Card, Colors, Intent } from '@blueprintjs/core'
import { CSSProperties, useCallback, useMemo, useState } from 'react'
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
import { Column, Row as RowType } from '../../Contracts/Components/Table'
import { Validation } from '../../Contracts/Hooks/useValidation'
import Bill from '../../Contracts/Models/Bill'
import { useAlert } from '../../Hooks/useAlert'
import { useGrid } from '../../Hooks/useGrid'
import { useToast } from '../../Hooks/useToast'
import useValidation from '../../Hooks/useValidation'
import { useWindow } from '../../Hooks/useWindow'
import BillService, { MonthSummary } from '../../Services/BillService'
import SupplierService from '../../Services/SupplierService'
import currencyFormat from '../../Util/currencyFormat'
import useMessageError from '../../Hooks/useMessageError'
import {
  addYears,
  endOfDay,
  format,
  parse,
  startOfDay,
  startOfMonth,
} from 'date-fns'
import { useScreen } from '../../Hooks/useScreen'
import { BillPaymentProps } from './BillPayment'
import useAsync from '../../Hooks/useAsync'
import strToNumber from '../../Util/strToNumber'
import CostCenterService from '../../Services/CostCenterService'

type BillPayloadCreate = Omit<Bill, 'due_date' | 'opening_date'> & {
  installments?: number
  due_date?: Date
  opening_date?: Date
}

const BillsScreen: React.FC<ScreenProps> = ({ screen }): JSX.Element => {
  const {
    payload,
    setPayload,
    screenStatus,
    setScreenStatus,
    changePayloadAttribute,
  } = useWindow<BillPayloadCreate>()
  const [monthSummary, setMonthSummary] = useState<{
    opened: string
    paid: string
    expired: string
  }>({
    opened: currencyFormat(0),
    paid: currencyFormat(0),
    expired: currencyFormat(0),
  })
  const { showErrorMessage } = useMessageError()

  const [, reloadSummary] = useAsync(async () => {
    try {
      const summary = (
        await BillService.getMonthSummary(
          startOfMonth(new Date()).toISOString().slice(0, 10)
        )
      ).data.data
      setMonthSummary({
        expired: currencyFormat(
          (summary.expired ?? 0) + (summary?.partially_paid_expired ?? 0)
        ),
        paid: currencyFormat(
          (summary.paid ?? 0) + (summary?.partially_paid ?? 0)
        ),
        opened: currencyFormat(summary.opened ?? 0),
      })
    } catch (error) {
      showErrorMessage(error, 'Não foi possível obter o resumo do mês.')
    }
  }, [])

  const { openSubScreen } = useScreen()
  const [selectedBills, setSelectedBills] = useState<BillPayloadCreate[]>([])

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

  const handleButtonCreateBillOnClick = async (stopLoad: Function) => {
    if (!validate()) {
      stopLoad()
      return
    }

    try {
      await BillService.create({
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

  const handleButtonUpdateBillOnClick = async (stopLoad: StopLoadFunc) => {
    decreaseWindowSize?.()

    if (!validate()) {
      return
    }

    try {
      const response = await BillService.update({
        ...payload,
        value: strToNumber(payload.value),
      } as Bill)

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

  const handleButtonDeleteBillOnClick = async (stopLoad: StopLoadFunc) => {
    try {
      await Promise.all(selectedBills.map((b) => BillService.delete(b.id)))
      showSuccessToast({
        message: 'Contas deletadas com sucesso',
        intent: Intent.SUCCESS,
      })
      setPayload({})
      setSelectedBills([])
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
            minWidth: 150,
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
      disabled: selectedBills.length === 0,
    },
    buttonEditProps: {
      disabled: selectedBills.length != 1,
    },
    reports: [
      {
        text: 'Total de contas a pagar por fornecedor',
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
        request: BillService.getTotalBillsBySuppliers,
        downloadable: true,
        reportRequestOptions: [
          { mimeType: 'text/csv', reportType: 'csv', responseType: 'text' },
        ],
      },
    ],
  }

  const onRowSelect = useCallback((row: Bill) => {
    setSelectedBills((prev) => {
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
  const rowClassNames = (r: RowType<Bill>): 'text-white' | undefined =>
    r.status != 'opened' ? 'text-white' : undefined
  const rowKey = (r: Bill) => r.id
  const isSelected = (
    row: import('/home/samreis/Documents/work/mms/mms-frontend/src/Contracts/Components/PaginatadeTable').Row<Bill>
  ): boolean => selectedBills.some((bill) => bill.id === row.id)
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
                selectedBills.length === 0 ||
                selectedBills.some((b) => b.status === BillStatuses.PAID)
              }
              className='font-bold'
              onClick={() => {
                openSubScreen<BillPaymentProps>(
                  {
                    id: 'bill-payment',
                  },
                  screen.id,
                  {
                    bills: selectedBills as any,
                    onPay: () => {
                      setSelectedBills([])
                      reloadSummary()
                      setReloadGrid(true)
                    },
                  }
                )
              }}
            >
              Pagar conta{selectedBills.length > 1 && 's'}
            </Button>
            <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
              <Button
                icon='clean'
                intent={Intent.DANGER}
                disabled={selectedBills.length === 0}
                onClick={() => {
                  setSelectedBills([])
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
                  className='py-2 px-3 text-white font-bold text-xs'
                  style={{ backgroundColor: Colors.RED3 }}
                >
                  Contas vencidas: {monthSummary?.expired}
                </Card>
                <Card
                  className='py-2 px-3 text-white font-bold text-xs'
                  style={{ backgroundColor: Colors.ORANGE3 }}
                >
                  Contas pendentes: {monthSummary?.opened}
                </Card>
                <Card
                  className='py-2 px-3 text-white font-bold text-xs'
                  style={{ backgroundColor: Colors.GREEN3 }}
                >
                  Contas pagas: {monthSummary?.paid}
                </Card>
              </Row>
            </div>
          </Render>
        </Bar>
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <AsyncSelect<Bill>
            name='supplier_id'
            id='bill-supplier-id'
            fill
            label='Fornecedor'
            required
            searchFunction={supplierFunction}
            buttonWidth='49%'
          />
          <AsyncSelect<Bill>
            fill
            label='Centro de custo'
            name='cost_center_id'
            buttonWidth='50%'
            searchFunction={costCenterFunction}
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
          <PaginatedTable<Bill>
            height='100%'
            onRowSelect={onRowSelect}
            request={BillService.getAll}
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

function getRowStyle(row: RowType<Bill>): CSSProperties {
  switch (row.status) {
    case 'paid':
      return {
        backgroundColor: Colors.GREEN3,
        color: `${Colors.WHITE}`,
      }
    case 'expired':
      return {
        backgroundColor: Colors.RED3,
        color: 'white',
      }
    case 'opened':
    default:
      return {
        backgroundColor: Colors.ORANGE3,
        color: 'white',
      }
  }
}
export default BillsScreen
