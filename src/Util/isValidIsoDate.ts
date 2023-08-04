export function isValidIsoDate(dateString: string): boolean {
  // Check if the argument is a string
  if (typeof dateString !== 'string') {
    return false
  }

  // Attempt to create a Date object from the provided string
  const date = new Date(dateString)

  // Check if the Date object is valid and if the input string matches the ISO format
  return !isNaN(date.getTime()) && date.toISOString().slice(0, 10) === dateString
}
