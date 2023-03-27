import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { FormEventHandler } from 'react'
import PaymentService from '../../../Services/PaymentService'
import { useToast } from '../../../Hooks/useToast'

export default function PaymentTab() {
  const elements = useElements()
  const stripe = useStripe()
  const { showErrorToast } = useToast()
  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    try {

      const result = await stripe.confirmSetup({
        //`Elements` instance that was used to create the Payment Element
        elements,
        redirect: 'if_required',
        confirmParams: {
          return_url: 'https://samerp.com',
        },
      })

      if (result.error) {
        showErrorToast(result.error.message!)
        return
      } else {
        PaymentService.confirmPlan(result.setupIntent)
      }
    } catch (e: unknown) {
      showErrorToast('Não foi possível fazer o pagamento. Por favor, tente novamente mais tarde')
    }
  }
  return <form onSubmit={handleSubmit}>
    <PaymentElement />
    <button disabled={!elements}>Submit</button>
  </form>
}
