import { useState } from 'react'
import Select, { SelectProps } from '../Select'
import { Option } from '../../Contracts/Components/Suggest'
import useAsync from '../../Hooks/useAsync'
import BillService from '../../Services/BillService'
import useMessageError from '../../Hooks/useMessageError'
import { useWindow } from '../../Hooks/useWindow'

export interface PaymentTypeSelectProps<T = any> extends SelectProps {
  name: keyof T
}

function PaymentTypeSelect<T = any>(props: PaymentTypeSelectProps<T>) {
  const { payload, changePayloadAttribute } = useWindow<T>()
  const { showErrorMessage } = useMessageError()
  const [paymentTypeOptions, setPaymentTypeOptions] = useState<Option[]>([])
  useAsync(async () => {
    try {
      const paymentTypes = (await BillService.getPaymentTypes()).data.data
      setPaymentTypeOptions(
        paymentTypes.map((paymentType) => ({
          label: paymentType.name,
          value: paymentType.id,
        }))
      )
    } catch (error) {
      showErrorMessage(
        error,
        'Não foi possível obter a lista de tipo de pagamentos'
      )
    }
  }, [])
  return (
    <Select
      items={paymentTypeOptions}
      activeItem={payload[props.name] as string}
      onChange={(paymentTypeOption) =>
        changePayloadAttribute(props.name, paymentTypeOption.value)
      }
      {...props}
    />
  )
}

export default PaymentTypeSelect
