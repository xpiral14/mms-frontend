export type DownloadOptions ={
  mimeType: string
}

export default {
  download(response: any, fileName: string, options?: DownloadOptions) {
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // IE variant
      (window.navigator as any).msSaveOrOpenBlob(new Blob([response.data],
        { type: options?.mimeType ?? 'application/pdf' }
      ),
      fileName
      )
    } else {
      const url = window.URL.createObjectURL(new Blob([response.data],
        { type: options?.mimeType ??  'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      setTimeout(() => {
        link.remove()
      }, 1000)
    }
  }
}
