/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable prefer-rest-params */
import {
  Button,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TextField,
  Theme,
} from '@material-ui/core'
import { Close, Edit } from '@material-ui/icons'
import { useSnackbar } from 'notistack'
import React, { useMemo, useState } from 'react'
import PlaceholderLoading from '../../Components/PlaceholderLoading'
import { orderStatus } from '../../Contracts/Enums'
import Order from '../../Contracts/Models/Order'
import OrderPiece from '../../Contracts/Models/OrderPiece'
import useAsync from '../../hooks/useAsync'
import { useAlert } from '../../hooks/useAlert'
import OrderPieceService from '../../services/OrderPieceService'
import OrderService from '../../services/OrderService'
import ModalEditOrderPiece from './ModalEditOrderPiece'

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    padding: '15px',
  },
  orderContainer: {
    padding: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    borderBottom: 'thin solid #e3e3e3',
    cursor: 'pointer',
  },
  breadcrumbCurrent: {
    color: '#000000',
  },
  grid: {
    height: '100%',
    width: '100%',
  },
  orderInfoHeader: {
    padding: '15px',
    backgroundColor: '#e3e3e3',
  },
  orderInfoBody: {},
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))
const OrderDetailsPlaceholder = () => (
  <div>
    <PlaceholderLoading width='100%' height='70px' margin='20px 0 0 0' />

    <PlaceholderLoading width='100%' height='57px' margin='5px 0 0 0' />
    <PlaceholderLoading width='100%' height='57px' margin='5px 0 0 0' />
    <PlaceholderLoading width='100%' height='57px' margin='5px 0 0 0' />
  </div>
)

const OrderListPlaceholder = () => (
  <div>
    <PlaceholderLoading width='100%' height='20px' margin='30px 0 0 0 0' />

    <PlaceholderLoading width='100%' height='66px' />
    <PlaceholderLoading width='100%' height='66px' margin='5px 0 0 0 ' />
    <PlaceholderLoading width='100%' height='66px' margin='5px 0 0 0' />
    <PlaceholderLoading width='100%' height='66px' margin='5px 0 0 0' />
    <PlaceholderLoading width='100%' height='66px' margin='5px 0 0 0' />
    <PlaceholderLoading width='100%' height='66px' margin='5px 0 0 0' />
  </div>
)

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null)
  const [orderSelected, setOrderSelected] = useState<Order | null>(null)
  const [editProductData, setEditProductData] = useState<OrderPiece | null>(
    null
  )
  const { openAlert } = useAlert()
  const { enqueueSnackbar } = useSnackbar()
  const loadOrderDetails = async () => {
    if (activeOrderId) {
      const response = await OrderService.getOne(activeOrderId as number)
      setOrderSelected(response.data)
    }
  }
  const [
    isGettingOrder,
    loadOrderDetailsWithLoading,
  ] = useAsync(loadOrderDetails, [activeOrderId])

  const classes = useStyles()

  const loadAllOrders = async () => {
    try {
      const response = await OrderService.getAll()
      setOrders(response.data.data)
    } catch (error) {
      enqueueSnackbar('Não foi possível obter a listagem de ordens de serviço', {variant: 'error'})
    }
  }

  const [loadingGetAll, loadAllOrdersWithLoading] = useAsync(() => {
    loadAllOrders()
  }, [])

  const handleDeleteConfirmm = (pieceId: number) => async () => {
    try {
      const response = await OrderPieceService.deleteOrderPiece(
        orderSelected?.id as number,
        pieceId
      )

      if (response.status !== 200) {
        enqueueSnackbar('Não foi possível desvincular a peça', {
          variant: 'error',
        })
      } else {
        await loadOrderDetailsWithLoading()
        await loadAllOrdersWithLoading()
        enqueueSnackbar('Peça desvinculada com sucesso', {
          variant: 'success',
        })
      }
    } catch (error) {
      enqueueSnackbar('Não foi possível desvincular a peça', {
        variant: 'error',
      })
    }
  }

  const allOrdersFormatted = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        total:
          order.orderPiece?.reduce(
            (p, c) => p + c.quantity * c.piece.price,
            0
          ) || 0,
      })),
    [orders]
  )

  const orderSelectedFormatted = useMemo(
    () => ({
      ...orderSelected,
      total: orderSelected?.orderPiece?.reduce(
        (p, c) => p + c.quantity * c.piece.price,
        0
      ) || 0
    }),
    [orderSelected]
  )
  return (
    <Grid container spacing={2} style={{ height: '100%' }}>
      <Grid item xs={12} style={{ height: '100%' }}>
        <Paper>
          <h2>Ordem de serviço</h2>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        {loadingGetAll ? (
          <OrderListPlaceholder />
        ) : (
          <Paper>
            <div className={classes.container}>
              <TextField
                placeholder='Ordem de serviço tal'
                label='Pesquisar'
                style={{ width: '100%' }}
              />
            </div>
            {allOrdersFormatted.map((order) => (
              <div
                style={{
                  backgroundColor:
                    activeOrderId === order.id ? '#008cff' : 'white',
                  color: activeOrderId === order.id ? 'white' : 'black',
                }}
                className={classes.orderContainer}
                key={order.id}
                onClick={() => setActiveOrderId(order.id)}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <div>{order?.costumer?.name}</div>
                  <div>
                    <b>{`R$ ${order.total}`}</b>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: activeOrderId === order.id ? 'white' : 'gray',
                  }}
                >
                  {order.notice}
                </div>
              </div>
            ))}
          </Paper>
        )}
      </Grid>
      {activeOrderId && (
        <Grid item xs={8}>
          <Paper>
            <Grid container>
              <Grid item xs={12}>
                <div className='d-flex justify-content-between align-items-center px-3 py-2'>
                  <h4>Informação da ordem de serviço</h4>
                  <Button variant='text'>...</Button>
                </div>
              </Grid>
              <Grid item xs={12}>
                {isGettingOrder ? (
                  <OrderDetailsPlaceholder />
                ) : orderSelectedFormatted ? (
                  <div>
                    <div
                      className={`${classes.orderInfoHeader} d-flex justify-content-between align-items-center`}
                    >
                      <div className='d-flex flex-column'>
                        <b>Vendedor</b>
                        <span>{orderSelectedFormatted?.userThatRegistered?.name}</span>
                      </div>

                      <div className='d-flex flex-column'>
                        <b>Data de criação</b>
                        <span>
                          {new Date(
                            orderSelectedFormatted.created_at
                          ).toLocaleDateString('pt-BR')}
                        </span>
                      </div>

                      <div className='d-flex flex-column'>
                        <b>Cliente</b>
                        <span>{orderSelectedFormatted?.costumer?.name}</span>
                      </div>

                      <div className='d-flex flex-column'>
                        <b>Status da ordem de serviço</b>
                        <span>
                          {
                            orderStatus[
                              orderSelectedFormatted.status as keyof typeof orderStatus
                            ]
                          }
                        </span>
                      </div>
                    </div>
                    <div className={classes.orderInfoBody}>
                      <Table>
                        <TableHead>
                          <TableCell>Peça</TableCell>
                          <TableCell>Valor</TableCell>
                          <TableCell>Quantidade</TableCell>
                          <TableCell>Valor total</TableCell>
                          <TableCell />
                        </TableHead>
                        <TableBody>
                          {orderSelectedFormatted.orderPiece?.map((oP) => (
                            <TableRow key={oP.id}>
                              <TableCell>{oP.piece.name}</TableCell>
                              <TableCell>{`R$ ${oP.piece.price}`}</TableCell>
                              <TableCell>{oP.quantity}</TableCell>
                              <TableCell>{`R$ ${(
                                oP.quantity * oP.piece.price
                              ).toFixed(2)}`}</TableCell>
                              <TableCell>
                                <IconButton
                                  aria-label='delete'
                                  color='secondary'
                                  onClick={() =>
                                    openAlert({
                                      text: `Você tem certeza que deseja deletar a peça ${oP.piece.name} ?`,
                                      handleConfirm: handleDeleteConfirmm(
                                        oP.pieceId
                                      ),
                                    })
                                  }
                                >
                                  <Close />
                                </IconButton>
                                <IconButton
                                  onClick={() => setEditProductData(oP)}
                                  aria-label='edit'
                                  color='primary'
                                >
                                  <Edit />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <TableFooter></TableFooter>
                      </Table>
                      <div className='d-flex justify-content-between align-items-center w-100 p-3'>
                        <div>
                          {orderSelectedFormatted?.notice && (
                            <div style={{ maxWidth: 400 }}>
                              <b>Observação: </b>
                              <span>{orderSelectedFormatted.notice}</span>
                            </div>
                          )}
                        </div>
                        <div className='d-flex flex-column'>
                          <b>Valor total:</b>
                          <b>
                            <span style={{ fontSize: 20 }}>
                              {`R$ ${orderSelectedFormatted.total}`}
                            </span>
                          </b>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>Não foi possível obter dados da Ordem de serviço</div>
                )}
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}
      <ModalEditOrderPiece
        data={editProductData}
        onClose={() => setEditProductData(null)}
        loadOrderDetails={loadOrderDetailsWithLoading as any}
        loadAllOrders={loadAllOrdersWithLoading as any}
      />
    </Grid>
  )
}

export default Orders
