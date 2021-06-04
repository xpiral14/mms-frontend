import React, { useState } from 'react'
import Modal from '../../Components/Modal'
import OrderPiece from '../../Contracts/Models/OrderPiece'
import {
  ModalEditOrderPieceBody,
  ModalEditOrderPieceContainer,
  ModalEditOrderPieceFooter,
  ModalEditOrderPieceHeader,
} from './style'
import { Button, Select, TextField } from '@material-ui/core'
import AlertDialog from '../../Components/Alert'
import OrderPieceService from '../../services/OrderPieceService'
import { useSnackbar } from 'notistack'
import useAsync from '../../hooks/useAsync'
import PieceService from '../../services/PieceService'
import Piece from '../../Contracts/Models/Piece'

interface ModalEditOrderPieceProps {
  type?: 'edit' | 'create'
  onClose: () => void
  data: OrderPiece | null
  loadOrderDetails: () => Promise<void>
  loadAllOrders: () => Promise<void>
}
const ModalEditOrderPiece: React.FC<ModalEditOrderPieceProps> = ({
  data,
  onClose,
  loadOrderDetails,
  loadAllOrders,
  type,
}) => {
  const [openConfirm, setOpenConfirm] = useState(false)
  const [payload, setPayload] = useState<any>(null)
  const [pieces, setPieces] = useState<Piece[]>([])
  const handleButtonSave = () => {
    setOpenConfirm(true)
  }
  const { enqueueSnackbar } = useSnackbar()

  const handleButtonConfirm = async () => {
    try {
      const response = await OrderPieceService.updatePiece(
        data?.orderId as number,
        data?.pieceId as number,
        payload
      )
      enqueueSnackbar('Quantidade alterada com sucesso', {
        variant: 'success',
      })

      setOpenConfirm(false)

      if (response.status !== 200) {
        enqueueSnackbar('Erro ao tentar alterar quantidade', {
          variant: 'error',
        })
      } else {
        await loadOrderDetails()
        await loadAllOrders()
        onClose()
      }
    } catch (error) {
      enqueueSnackbar('Erro ao tentar alterar quantidade', {
        variant: 'error',
      })
    }
  }

  useAsync(async () => {
    if(data && type === 'create'){
      const paginatedPieces = await PieceService.getAll()
      setPieces(paginatedPieces.data.data)
    }
  }, [data, type])

  return (
    <Modal
      modalProps={
        {
          open: Boolean(data),
          onClose: onClose,
        } as any
      }
    >
      {' '}
      <ModalEditOrderPieceContainer>
        <ModalEditOrderPieceHeader>
          <div className='p-2'>
            <h4>{data?.piece.name}</h4>
          </div>
        </ModalEditOrderPieceHeader>
        <ModalEditOrderPieceBody className='mt-2 p-2'>
          {type === 'create' && (
            <Select>
              {pieces.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.name}
                </option>
              ))}
            </Select>
          )}
          <TextField
            inputProps={{ min: 0 }}
            style={{ width: '100%' }}
            type='number'
            label='Quantidade'
            defaultValue={data?.quantity}
            onChange={(evt) =>
              setPayload({
                quantity: evt.target.value,
              })
            }
          />
        </ModalEditOrderPieceBody>
        <ModalEditOrderPieceFooter className='d-flex justify-content-between p-2'>
          <Button variant='contained' color='secondary' onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={handleButtonSave}
          >
            Salvar
          </Button>
        </ModalEditOrderPieceFooter>
      </ModalEditOrderPieceContainer>
      <AlertDialog
        open={openConfirm}
        handleClose={() => setOpenConfirm(false)}
        handleConfirm={handleButtonConfirm}
        text='Você tem certeza que deseja alterar a quantidade de peças?'
      />
    </Modal>
  )
}

export default ModalEditOrderPiece
