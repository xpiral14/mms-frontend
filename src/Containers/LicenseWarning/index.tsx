import { Intent } from '@blueprintjs/core'
// import { differenceInDays, format } from 'date-fns'
// import { ptBR } from 'date-fns/locale'
import React, { useCallback, useState } from 'react'
import Button from '../../Components/Button'
import Row from '../../Components/Layout/Row'
import PaymentModal from '../PaymentModal'
// import License from '../../Contracts/Models/License'
import { WarningContainer } from './style'

const LicenseWarning = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const toggleShow = useCallback(() => setShowPaymentModal((prev) => !prev), [])
  return (
    <WarningContainer>
      <Row middle justifyBetween>
        <span>
          A sua licensa irá se encerrar em
          {/* <strong>
            {licenseToDateFormatted} ({dayDistance} dias).
          </strong>{' '} */}
          Por favor, renove a licensa para continuar tendo acesso normalmente.
        </span>
        <Button intent={Intent.SUCCESS} onClick={toggleShow}>
          {' '}
          Renovar licensa
        </Button>

        <PaymentModal isOpen={showPaymentModal} onClose={toggleShow} />
      </Row>
    </WarningContainer>
  )
}

export default LicenseWarning
