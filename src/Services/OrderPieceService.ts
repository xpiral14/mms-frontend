import api from '../Config/api'

export default class OrderPieceService {
  static DEFAULT_PATH = '/company/order'

  static async updatePiece(
    orderId: number,
    pieceId: number,
    payload: { quantity: number }
  ) {
    return api.post<null>(
      `${this.DEFAULT_PATH}/${orderId}/piece/${pieceId}`,
      payload
    )
  }

  static async deleteOrderPiece(orderId: number, pieceId: number){

    return api.delete<null>(`${this.DEFAULT_PATH}/${orderId}/piece/${pieceId}`)
  }
}
