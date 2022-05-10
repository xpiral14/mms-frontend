export default function cleanNumericInput(inputValue?: string){
  if(!inputValue) return ''
  return inputValue.trim().replace(/[^\d]/g, '')
}
