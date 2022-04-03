import api from '../Config/api'

const DEFAULT_PATH = '/order'
export default class OrderPartService {
  static async updatePiece(
    orderId: number,
    pieceId: number,
    payload: { quantity: number }
  ) {
    return api.post<null>(
      `${DEFAULT_PATH}/${orderId}/piece/${pieceId}`,
      payload
    )
  }

  static async deleteOrderPart(orderId: number, pieceId: number) {
    return api.delete<null>(`${DEFAULT_PATH}/${orderId}/piece/${pieceId}`)
  }
}
