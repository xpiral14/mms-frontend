import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { ClockContainer, DayContent, TimerContent } from './styles'
import { ptBR } from 'date-fns/locale'

const Clock = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <ClockContainer>
      <TimerContent>
        {format(now, 'HH')}<span className='blink'>:</span>
        {format(now, 'mm')}
      </TimerContent>
      <DayContent>
        {format(now, 'cccc, d \'de\'  LLLL \'de\' yyyy', { locale: ptBR })}
      </DayContent>
    </ClockContainer>
  )
}

export default Clock
