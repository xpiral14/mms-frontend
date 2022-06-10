export default function groupBy<R = Record<string, any>>(xs: any, key: any): R {
  return xs.reduce(function (rv: any, x: any) {
    (rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}
