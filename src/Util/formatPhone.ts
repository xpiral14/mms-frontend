import cleanNumericInput from './cleanNumericInput'

export default function formatPhone(phone?: string) {
  const cleaned = cleanNumericInput(phone)
  if (!cleaned) return ''

  if (cleaned.length < 9) return phone

  return cleaned.length === 9
    ? formatPhoneWithoutDDD(cleaned)
    : formatPhoneWithDDD(cleaned)
}

function formatPhoneWithoutDDD(phone: string) {
  return phone.replace(/(\d{5})(\d{4})/, '$1-$2')
}

function formatPhoneWithDDD(phone: string) {
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}
