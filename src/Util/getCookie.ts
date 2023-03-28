export default function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  console.log(document.cookie)
  const products = value.split(`; ${name}=`)
  if (products.length === 2)
    return products.pop()?.split(';').shift()?.replace(/%3D$/, '=')
}
