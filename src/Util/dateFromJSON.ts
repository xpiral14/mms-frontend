export default function dateFromJSON(date?: string) {
  if (!date) return undefined
  const dt = new Date(date)

  return new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000)
}
