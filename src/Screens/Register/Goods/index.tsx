/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import GoodService from '../../../Services/GoodService'
import { StopLoadFunc } from '../../../Contracts/Components/RegistrationButtonBarProps'
import { useWindow } from '../../../Hooks/useWindow'
import { useAlert } from '../../../Hooks/useAlert'
import { ScreenStatus } from '../../../Constants/Enums'
import { Intent } from '@blueprintjs/core'
import { useToast } from '../../../Hooks/useToast'
import useValidation from '../../../Hooks/useValidation'
import { Validation } from '../../../Contracts/Hooks/useValidation'
import Good from '../../../Contracts/Models/Good'
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'
import { GoodRegisterScreenProps } from '../../../Contracts/Screen/Register/Goods'
import { Column } from '../../../Contracts/Components/Table'
import InputDate from '../../../Components/InputDate'
import Table from '../../../Components/Table'
import GoodProduct from '../../../Contracts/Models/GoodProduct'
import Button from '../../../Components/Button'
import Bar from '../../../Components/Layout/Bar'
import { useScreen } from '../../../Hooks/useScreen'
import { AddProductToGoodProps } from '../../../Contracts/Screen/AddProductToGood'
import currencyFormat from '../../../Util/currencyFormat'
import useMessageError from '../../../Hooks/useMessageError'
import { DistributeGoodsProps } from '../../../Contracts/Screen/DistributeGoods'

const GoodsScreen: React.FC<GoodRegisterScreenProps> = (
  {
    screen,
    supplierId,
  },
): JSX.Element => {
  const { screenStatus, setScreenStatus, payload, setPayload, changePayloadAttribute } = useWindow<Good>()
  const { openSubScreen } = useScreen()

  const validations = [
    {
      errorMessage: 'O número da nota fiscal é obrigatória',
      inputId: screen.createElementId('invoice-number'),
      check: () => Boolean(payload.invoice_number),
    },
    {
      check: () => Boolean(payload.received_at),
      errorMessage: 'A data de recebimento é obrigatória',
      inputId: screen.id + 'received_at',
    },
  ] as Validation[]
  const { validate } = useValidation(validations)
  const paginatedColumns = useMemo(
    () =>
      [
        {
          name: 'Número da nota fiscal',
          keyName: 'invoice_number',
          style: {
            width: 50,
          },
        },
        {
          name: 'Data de recebimento',
          formatText: (row) => new Date(row!.received_at!).toLocaleDateString(),
        },
        {
          name: 'Status de distribuição',
          formatText: (row) => (row!.received_at ? 'Recebido' : 'Não recebido'),
        },
        {
          name: 'Valor total',
          formatText: (row) => currencyFormat(row?.good_products?.reduce((t: number, c: GoodProduct) => t + c.value, 0) ?? 0),
        },
      ] as Column[],
    [],
  )
  const columns = useMemo(
    () =>
      [
        {
          name: 'Referencia',
          formatText: (row) => row?.product?.reference ?? '-',
        },
        {
          name: 'Produto',
          formatText: (row) => row?.product?.name ?? '-',
        },
        {
          name: 'Quantidade',
          formatText: (row) => row?.quantity ?? '0',
        },
        {
          name: 'Valor unitário',
          formatText: (row) =>
            currencyFormat((row!.value ?? 0) / (row!.quantity ?? 0)),
        },
        {
          name: 'Valor total',
          formatText: (row) => currencyFormat(row?.value ?? 0),
        },
      ] as Column[],
    [],
  )
  const handleAddProduct = () => {
    openSubScreen<AddProductToGoodProps>(
      {
        id: 'good-product-register',
      },
      screen.id,
      {
        onAddProduct: (p) =>
          setPayload((prev) => ({
            ...prev,
            good_products: [...(prev?.good_products || []), p as any],
          })),
      },
    )
  }

  const { showSuccessToast } = useToast()
  const { showErrorMessage } = useMessageError()
  const { openAlert } = useAlert()
  const createGood = async (stopLoad: StopLoadFunc) => {
    try {
      const response = await GoodService.create({
        supplier_id: supplierId,
        distributed_at: null,
        received_at: (payload.received_at as Date)?.toISOString(),
        invoice_number: payload.invoice_number!,
        good_products:
          (payload.good_products?.map((gp) => ({
            product_id: gp.product_id,
            quantity: gp.quantity,
            value: gp.value,
          })) as any) || [],
      })

      showSuccessToast('Registro de mercadoria cadastrado com sucesso.')
      setPayload({
        ...response.data.data,
        received_at: new Date(response.data.data.received_at),
      })
      setScreenStatus(ScreenStatus.SEE_REGISTERS)
      openAlert({
        text: 'Deseja distribuir suas mercadorias para seus estoques agora?',
      })
    } catch (error: any) {
      showErrorMessage(
        error,
        'Não foi possível fazer o cadastro do registro de mercadoria. Por favor, tente novamente',
      )
    }

    stopLoad()
  }

  const editGood = (stopLoad: StopLoadFunc) => {
    stopLoad()
    showSuccessToast('O registro de mercadoria foi atualizado com sucesso.')
  }

  const handleSaveButtonClick = (stopLoad: StopLoadFunc) => {
    if (!validate()) {
      stopLoad()
      return
    }

    if (!payload.good_products?.length) {
      openAlert({
        text: 'Tem certeza que deseja cadastrar um registro de mercadorias que não possui mercadorias?',
        icon: 'warning-sign',
        intent: Intent.WARNING,
        confirmButtonText: 'CADASTRAR SEM MERCADORIA',
        onConfirm: doAction,
        onCancel() {
          stopLoad()
        },
        onClose() {
          stopLoad()
        },
      })
    } else {
      doAction()
    }

    async function doAction() {
      if (!payload.id) {
        createGood(stopLoad)
      } else {
        editGood(stopLoad)
      }
    }
  }

  const handleDistributeGoodButtonClick = () => {
    openSubScreen<DistributeGoodsProps>({
      id: 'distribute-goods',
    }, screen.id, {
      good: payload,
    })
  }
  return (
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar
          handleSaveButtonOnClick={handleSaveButtonClick}
        />
      </Row>
      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='my-2'>
          <Bar>
            <Button intent={Intent.PRIMARY} onClick={handleDistributeGoodButtonClick} text='Distribuir mercadorias'
              disabled={!payload.id || !!payload.distributed_at} />
          </Bar>
        </Row>
      </Render>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <InputText
            id={screen.createElementId('invoice-number')} value={payload.invoice_number ?? ''}
            label='Número da nota fiscal'
            onChange={(e) => changePayloadAttribute('invoice_number', e.target.value)} />
          <InputDate
            inputProps={{
              style: { width: '100%' },
            }}
            timePrecision='minute'
            label='Data de recebimento'
            id={screen.id + 'received_at'}
            onChange={d => changePayloadAttribute('received_at', d)}
            value={payload.received_at as Date}
          />
        </Row>

        <Row className='my-2'>
          <Bar>
            <Button icon='add' onClick={handleAddProduct} intent={Intent.PRIMARY}>
              Adicionar produto
            </Button>
          </Bar>
        </Row>

        <Table rows={payload.good_products as any} columns={columns} />
      </Render>

      <Render renderIf={screenStatus === ScreenStatus.SEE_REGISTERS}>
        <Row className='h-100'>
          <PaginatedTable
            height='100%'
            customRequest={(page, limit) =>
              GoodService.getAll(supplierId, page, limit)
            }
            containerProps={{
              style: {
                flex: 1,
              },
            }}
            columns={paginatedColumns}
            isSelected={(row: any) => row.id === payload?.id}
            onRowSelect={(r) =>
              setPayload({
                ...r,
                received_at: new Date(r.received_at),
              })
            }
          />
        </Row>
      </Render>
    </Container>
  )
}

export default GoodsScreen
