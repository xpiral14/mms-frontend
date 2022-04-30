export default function cleanNumericInput(inputValue: string){
  return inputValue.trim().replace(/[^\d]/g, '')
}