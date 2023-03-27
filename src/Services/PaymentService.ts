import api from '../Config/api'
import { SetupIntent } from '@stripe/stripe-js'

export default {
  getSetupIntent: () => {
    return api.get('payments/client-secret')
  },
  getbillingPortalURl() {
    return api.get('/payments/billing-portal')
  },
  confirmPlan(setupIntent: SetupIntent) {
    return api.post('/payments/plan', setupIntent)
  },
}
