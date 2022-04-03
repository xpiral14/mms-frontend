export interface Meta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  firstPage: number
}
export default interface Paginated<T> {
  meta: Meta
  data: T[]
}
