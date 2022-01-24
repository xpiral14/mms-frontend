const toCamel = (s: any) =>
  s.replace(/([-_][a-z])/gi, ($1 : any) =>
    $1
      .toUpperCase()
      .replace('-', '')
      .replace('_', ''),
  )

export default function keysToCamel(o: any): any {
  if (typeof o === 'object' && o !== null) {
    let n : any= {}

    if (Array.isArray(o)) {
      n = []
    }

    Object.keys(o).forEach(k => {
      n[toCamel(k)] = keysToCamel(o[k])
    })

    return n
  }
  if (Array.isArray(o)) {
    return o.map(i => keysToCamel(i))
  }

  return o
}