import api from '../Config/api'

export default class FileService {
  public static async downloadFile(fileUuid: string) {
    const response = await api.get(`files/${fileUuid}/download`, {
      responseType: 'blob'
    })
    const fileName = 'nome do arquivo'
    if (window.navigator && (window.navigator as any).msSaveOrOpenBlob) { // IE variant
      (window.navigator as any).msSaveOrOpenBlob(new Blob([response.data],
        {type: 'application/pdf'}
      ),
      fileName
      )
    } else {
      const url = window.URL.createObjectURL(new Blob([response.data],
        {type: 'application/pdf'}))
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

