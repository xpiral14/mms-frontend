import api from '../Config/api'

export default {
  getSetupIntent: () => {
    return api.get('payment/setupIntent')
  }
}