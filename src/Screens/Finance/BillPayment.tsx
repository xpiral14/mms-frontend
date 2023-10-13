import React, { useEffect, useMemo } from 'react'
import Container from '../../Components/Layout/Container'
import Box from '../../Components/Layout/Box'
import PaymentTypeSelect from '../../Components/ScreenComponents/PaymentTypeSelect'
import Transaction from '../../Contracts/Models/Transaction'
import Bar from '../../Components/Layout/Bar'
import Button from '../../Components/Button'
import { Intent } from '@blueprintjs/core'
import { MdPayment } from 'react-icons/md'
import Row from '../../Components/Layout/Row'
import TextArea from '../../Components/ScreenComponents/TextArea'
import Bill from '../../Contracts/Models/Bill'
import ScreenProps from '../../Contracts/Components/ScreenProps'
import { useWindow } from '../../Hooks/useWindow'
import InputNumber from '../../Components/InputNumber'
import currencyFormat from '../../Util/currencyFormat'
import Table from '../../Components/Table'
import strToNumber from '../../Util/strToNumber'
import BillService from '../../Services/BillService'
import useMessageError from '../../Hooks/useMessageError'
import { useToast } from '../../Hooks/useToast'

export interface BillPaymentProps {
  bills: Bill[]
  onPay?: () => void
}

interface BillPaymentScreenProps extends ScreenProps, BillPaymentProps {}
const BillPayment = (props: BillPaymentScreenProps) => {
  const { changePayloadAttribute, setPayload, payload } = useWindow<{
    bill_transactions: Partial<Transaction & { bill_id: number }>[]
    payment_type?: string
    annotations?: string
  }>()

  useEffect(() => {
    changePayloadAttribute(
      'bill_transactions',
      props.bills.map(
        (b) =>
          ({
            bill_id: b.id,
            bill: b,
            addition: 0,
            discount: 0,
            fees: 0,
            value: +b.value,
          } as Partial<Transaction>)
      )
    )
  }, [])

  const totalValue = useMemo(
    () =>
      payload.bill_transactions?.reduce(
        (totalValue, bill) =>
          strToNumber(bill.addition as string) +
          strToNumber(bill.fees as string) +
          strToNumber(bill.value as string) -
          strToNumber(bill.discount) +
          totalValue,
        0
      ),
    [payload]
  )
  const { showErrorMessage } = useMessageError()
  const { showSuccessToast } = useToast()
  const onSave = async () => {
    try {
      await Promise.all(
        payload.bill_transactions?.map((billTransaction) =>
          BillService.payBill(billTransaction.bill_id!, {
            ...billTransaction,
            value: strToNumber(billTransaction.value),
            annotation: payload.annotations,
            payment_type: payload.payment_type,
          })
        ) ?? []
      )
      props?.onPay?.()
      showSuccessToast('Os pagamentos foram efetuados com sucesso.')
      props.screen.close()
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível salvar os pagamentos. Por favor, tente novamente'
      )
    }
  }
  return (
    <Container>
      <Bar>
        <Button
          intent={Intent.SUCCESS}
          text='Pagar'
          icon={<MdPayment />}
          onClick={onSave}
        />
        <h6>
          <strong>Valor total:</strong> {currencyFormat(totalValue)}
        </h6>
      </Bar>
      <Box>
        <Row>
          <PaymentTypeSelect<Transaction>
            name='payment_type'
            buttonWidth='100%'
            label='Forma de pagamento*'
          />
        </Row>
        <Row>
          <TextArea<Transaction>
            name='annotation'
            id='bill-payment-id'
            style={{ width: '100%' }}
            label='Anotações'
          />
        </Row>
      </Box>
      <Box className='mt-2'>
        <Table
          stripped={false}
          interactive={false}
          columns={[
            {
              name: 'Referencia',
              cellRenderer: (_, r) => (
                <p className='flex align-center margin-0'>
                  {r?.bill?.reference}
                </p>
              ),
              style: { width: '100%', verticalAlign: 'middle' },
            },
            {
              name: 'Saldo',
              cellRenderer: (_, billTransaction) => {
                return (
                  <p className='flex align-center margin-0'>
                    {currencyFormat(
                      strToNumber(billTransaction.bill?.value) -
                        (strToNumber(billTransaction.addition as string) +
                          strToNumber(billTransaction.fees as string) +
                          strToNumber(billTransaction.value as string) +
                          strToNumber(billTransaction.discount))
                    )}
                  </p>
                )
              },
              style: { width: 130, minWidth: 130, verticalAlign: 'middle' },
            },
            {
              name: 'Juros',
              cellRenderer: (_, row, index) => (
                <InputNumber
                  value={row.fees}
                  style={{ margin: 0, width: 130 }}
                  inputStyle={{ width: 90 }}
                  onValueChange={(v) =>
                    setPayload((prev) => {
                      const copy = {
                        ...prev,
                        bills: prev.bill_transactions,
                      }
                      copy.bills![index].fees = v!
                      return copy
                    })
                  }
                />
              ),
            },
            {
              name: 'Desconto',
              cellRenderer: (_, row, index) => (
                <InputNumber
                  value={row.discount}
                  style={{ margin: 0, width: 130 }}
                  inputStyle={{ width: 90 }}
                  onValueChange={(v) =>
                    setPayload((prev) => {
                      const copy = {
                        ...prev,
                        bills: prev.bill_transactions,
                      }
                      copy.bills![index].discount = v!
                      return copy
                    })
                  }
                />
              ),
            },
            {
              name: 'Acréscimo',
              cellRenderer: (_, row, index) => (
                <InputNumber
                  value={row.addition}
                  style={{ margin: 0, width: 130 }}
                  inputStyle={{ width: 90 }}
                  onValueChange={(v) =>
                    setPayload((prev) => {
                      const copy = {
                        ...prev,
                        bills: prev.bill_transactions,
                      }
                      copy.bills![index].addition = v!
                      return copy
                    })
                  }
                />
              ),
            },
            {
              name: 'Valor pago',
              cellRenderer: (_, row, index) => (
                <InputNumber
                  value={row.value}
                  style={{ margin: 0, width: 130 }}
                  inputStyle={{ width: 90 }}
                  max={props.bills[index].value}
                  min={0}
                  onValueChange={(v) =>
                    setPayload((prev) => {
                      const copy = {
                        ...prev,
                        bills: prev.bill_transactions,
                      }
                      copy.bills![index].value = v!
                      return copy
                    })
                  }
                />
              ),
            },
          ]}
          rows={payload.bill_transactions ?? []}
        />
      </Box>
    </Container>
  )
}

export default BillPayment
