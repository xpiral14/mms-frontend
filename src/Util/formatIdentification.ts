export default function formatIdentification(identification?: string) {
  if (!identification) return ''

  if (identification.length < 11) return identification

  return identification.length > 11
    ? formatCNPJ(identification)
    : formatCPF(identification)
}

function formatCPF(identification: string) {
  return identification.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatCNPJ(identification: string) {
  return identification.replace(
    /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
    '$1.$2.$3/$4-$5'
  )
}
