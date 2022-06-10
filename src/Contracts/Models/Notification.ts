export default interface Notification<D = Record<string, string | any>> {
  id: string;
  message: string,
  read_at?: string
  type?: string,
  data?: D
  date: string
  created_at: string
}
