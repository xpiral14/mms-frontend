/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo } from 'react'
import { ProductStockMovementScreenProps } from '../../Contracts/Screen/ProductStockMovement'
import { Card } from '@blueprintjs/core'
import Row from '../../Components/Layout/Row'
import PaginatedTable from '../../Components/PaginatedTable'
import ProductStockMovementModel from '../../Contracts/Models/ProductStockMovement'
import ProductStockMovementService from '../../Services/ProductStockMovementService'
import { Column } from '../../Contracts/Components/Table'

const ProductStockMovement = (props: ProductStockMovementScreenProps) => {
  const columns = useMemo(
    () =>
      [
        {
          name: 'Ação',
          keyName: 'action_name',
          filters: [
            {
              name: 'Ação',
              keyName: 'action',
              type: 'checkbox',
              value: [
                { label: 'Estoque', value: 'STOCK' },
                { label: 'Mercadoria', value: 'GOOD' },
                { label: 'Ordem de serviço', value: 'SERVICE_ORDER' },
              ],
            },
          ],
        },
        {
          name: 'Tipo de movimento',
          keyName: 'type_name',
          filters: [
            {
              name: 'Tipo',
              keyName: 'type',
              type: 'checkbox',
              value: [
                { label: 'Incremento', value: 'INCREASE' },
                { label: 'Decremento', value: 'DECREASE' },
              ],
            },
          ],
        },
        {
          name: 'Quantidade',
          keyName: 'quantity',
          formatText: (row) =>
            row?.quantity + ` ${props.productStock.product?.unit?.name}`,
        },
        {
          name: 'Data do movimento',
          keyName: 'created_at',
          formatText: (row) => new Date(row!.created_at).toLocaleString(),
          filters: [
            {
              keyName: 'created_at',
              name: 'de',
              type: 'from_date',
            },
            {
              keyName: 'created_at',
              name: 'até',
              type: 'to_date',
            },
          ],
        },
      ] as Column<ProductStockMovementModel>[],
    []
  )
  return (
    <Row className='h-100'>
      <Row className='w-100'>
        <Card className='w-100 p-2'>
          <ul className='list-none p-0' style={{fontSize: '1rem'}}>
            <li>
              <b>Produto:</b> {props.productStock.product?.name}
            </li>
            <li>
              <b>Quantidade atual no estoque:</b> {props.productStock.quantity}{' '}
              {props.productStock.product?.unit?.name}
            </li>
          </ul>
        </Card>
      </Row>

      <Row style={{ height: 'calc(100% - 80px)' }}>
        {
          <PaginatedTable<ProductStockMovementModel>
            columns={columns}
            customRequest={(page, limit, filters, options) =>
              ProductStockMovementService.getAll(
                props.productStock,
                page,
                limit,
                filters,
                options
              )
            }
            downloadable
            reportRequestOptions={[
              {
                mimeType: 'text/csv',
                reportType: 'csv',
                name: 'CSV',
                responseType: 'text',
              },
            ]}
          />
        }
      </Row>
    </Row>
  )
}

export default ProductStockMovement
