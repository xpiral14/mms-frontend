import Piece from './Piece'

export default interface OrderPiece {
  id: number
  orderId: number
  pieceId: number
  quantity: number
  created_at: string
  updated_at: string
  piece: Piece
}
