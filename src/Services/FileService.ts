import api from '../Config/api'
import DownloadService from './DownloadService'

export default class FileService {
  public static async downloadFile(fileUuid: string, reportName: string) {
    const response = await api.get(`files/${fileUuid}/download`, {
      responseType: 'blob'
    })

    DownloadService.download(response, reportName)
  }
}

