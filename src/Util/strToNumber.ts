export default function strToNumber(stringNumber?: string | number) {
  if (!stringNumber) return 0
  if (typeof stringNumber === 'number') return stringNumber

  const asNumber = Number(stringNumber)
  if (!Number.isNaN(asNumber)) {
    return asNumber
  }

  if (stringNumber.includes(',')) {
    stringNumber = stringNumber.replace(/\./g, '')
  }
  return +stringNumber.replace(',', '.')
}
