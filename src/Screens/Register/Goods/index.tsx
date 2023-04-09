/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useMemo, useState } from 'react'
import RegistrationButtonBar from '../../../Components/RegistrationButtonBar'
import InputText from '../../../Components/InputText'
import PaginatedTable from '../../../Components/PaginatedTable'
import GoodService from '../../../Services/GoodService'
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
import Good from '../../../Contracts/Models/Good'
import Render from '../../../Components/Render'
import Container from '../../../Components/Layout/Container'
import Row from '../../../Components/Layout/Row'
import { GoodRegisterScreenProps } from '../../../Contracts/Screen/Register/Goods'
import { Column, Row as TableRow } from '../../../Contracts/Components/Table'
import { format } from 'date-fns'
import { DateInput } from '@blueprintjs/datetime'
import InputDate from '../../../Components/InputDate'
import Table from '../../../Components/Table'
import GoodProduct from '../../../Contracts/Models/GoodProduct'
import Button from '../../../Components/Button'
import Bar from '../../../Components/Layout/Bar'
import { useScreen } from '../../../Hooks/useScreen'
import { AddProductToGoodProps } from '../../../Contracts/Screen/AddProductToGood'
import currencyFormat from '../../../Util/currencyFormat'

const GoodsScreen: React.FC<GoodRegisterScreenProps> = ({
  screen,
  supplierId,
}): JSX.Element => {
  const { screenStatus, payload, setPayload } = useWindow<Good>()
  const { openSubScreen } = useScreen()
  const [goodProducts, setGoodProducts] = useState<Partial<GoodProduct>[]>([])
  const paginatedColumns = useMemo(
    () =>
      [
        {
          name: 'Data de recebimento',
          keyName: 'received_at',
          formatText: (row) => new Date(row!.received_at!).toLocaleDateString(),
        },
        {
          name: 'Status de distribuição',
          keyName: 'distributed_at',
          formatText: (row) => (row!.received_at ? 'Recebido' : 'Não recebido'),
        },
      ] as Column[],
    []
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
          formatText: (row) => currencyFormat(row!.quantity / row!.value ?? 0),
        },
        {
          name: 'Valor total',
          formatText: (row) => currencyFormat(row?.value ?? 0),
        },
      ] as Column[],
    []
  )
  const handleAddProduct = () => {
    openSubScreen<AddProductToGoodProps>(
      {
        id: 'good-product-register',
      },
      screen.id,
      {
        onAddProduct: (p) => setGoodProducts((prev) => [...prev, p]),
      }
    )
  }

  return (
    <Container style={{ height: 'calc(100% - 40px)' }}>
      <Row>
        <RegistrationButtonBar />
      </Row>
      <Render renderIf={screenStatus !== ScreenStatus.SEE_REGISTERS}>
        <Row>
          <InputDate
            inputProps={{
              style: { width: '100%' },
            }}
            label='Data de recebimento'
            id={screen.id + 'received_at'}
            value={payload.received_at as Date}
            onChange={(date) => setPayload({ received_at: date })}
          />
        </Row>

        <Row className='my-2'>
          <Bar>
            <Button onClick={handleAddProduct} intent={Intent.PRIMARY}>
              Adicionar produto
            </Button>
          </Bar>
        </Row>

        <Table rows={goodProducts as any} columns={columns} />
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
          />
        </Row>
      </Render>
    </Container>
  )
}

export default GoodsScreen
