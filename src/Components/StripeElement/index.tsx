import React, { FC, useEffect, useMemo, useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'

import { loadStripe } from '@stripe/stripe-js'
import PaymentService from '../../Services/PaymentService'

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_API_KEY!)
const StripeElement: FC = ({ children }) => {
  const [setupIntent, setSetupIntent] = useState<Record<string, any>>({})
  
  const stripeOptions = useMemo(
    () => ({
      clientSecret: setupIntent.client_secret,
    }),
    [setupIntent]
  )
  
  useEffect(() => {
    PaymentService.getSetupIntent().then((r) => {
      setSetupIntent(r.data)
    })
  })

  if(stripeOptions.clientSecret)
    return (
      <Elements stripe={stripePromise} options={stripeOptions}>
        {children}
      </Elements>
    )

  return <>{children}</>
}

export default StripeElement
