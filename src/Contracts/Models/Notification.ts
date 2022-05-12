export default interface Notification {
  id: number;
  message: string,
  readed?: boolean
  type?: string,
  payload?: string;
  date: string
}
