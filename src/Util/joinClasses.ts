export default function joinClasses(...classes: any[]) {
  return typeof classes?.[0] === 'string'
    ? classes.join(' ')
    : Object.entries(classes[0])
      .filter(([, value]) => value)
      .map(([k]) => k)
      .join(' ')
}
