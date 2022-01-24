export default function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  console.log(parts)
  if (parts.length === 2) return parts.pop()?.split(';').shift()?.replace(/%3D$/, '=')
}