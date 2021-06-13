import { ScreenStatus } from '@Constants/Enums'
import React, { useState } from 'react'
import RegistrationButtonBar from '../../Components/RegistrationButtonBar'

const PartsScreen: React.FC = (): JSX.Element => {
  const [status, setStatus] = useState<ScreenStatus>(ScreenStatus.VISUALIZE)

  return (
    <>
      <RegistrationButtonBar status={status} setStatus={setStatus} />
    </>
  )
}

export default PartsScreen
