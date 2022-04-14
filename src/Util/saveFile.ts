export default async function saveFile(blob: Blob, fileName: string) {
  const a = document.createElement('a')
  a.download = fileName
  a.href = URL.createObjectURL(blob)
  a.addEventListener('click', () => {
    setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000)
  })
  a.click()
}
