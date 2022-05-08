import getDateWithTz from './getDateWithTz'

export default function dateFromJSON(date?: string) {
  if (!date) return undefined
  const dt = new Date(date)

  return getDateWithTz(dt)
}
