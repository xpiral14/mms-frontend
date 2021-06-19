import api from '../Config/api'

export default class OrderPieceService {
  static DEFAULT_PATH = '/company/order'

  static async updatePiece(
    orderId: number,
    pieceId: number,
    payload: { quantity: number }
  ) {
    return api.post<null>(`/company/order/${orderId}/piece/${pieceId}`, payload)
  }

  static async deleteOrderPiece(orderId: number, pieceId: number) {
    return api.delete<null>(`/company/order/${orderId}/piece/${pieceId}`)
  }
}
