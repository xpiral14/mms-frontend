import React, { FC, useCallback, useState } from 'react'
import { Intent } from '@blueprintjs/core'
import Button from '../../Components/Button'
import Row from '../../Components/Layout/Row'
import { WarningContainer } from './style'
import PaymentModal from '../PaymentModal'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LicenseWarningProps {
}
const LicenseWarning: FC<LicenseWarningProps> = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const toggleShow = useCallback(() => setShowPaymentModal((prev) => !prev), [])
  return (
    <WarningContainer>
      <Row middle justifyBetween>
        <span>
          A sua licensa irá se encerrar em
          <strong>
            {' 13/06/2023 (25 dias)'}.
          </strong>
          Por favor, renove a licensa para continuar tendo acesso normalmente.
        </span>
        <Button intent={Intent.SUCCESS} onClick={toggleShow}>
          Renovar licensa
        </Button>

        <PaymentModal isOpen={showPaymentModal} onClose={toggleShow} />
      </Row>
    </WarningContainer>
  )
}

export default LicenseWarning
