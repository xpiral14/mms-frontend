import { Colors } from '@blueprintjs/core'
import Clock from '../Components/Clock'

export default function Index() {
  return (
    <div
      className='main-screen-container'
      style={{
        position: 'relative',
        height: 'calc(100vh - 60px)',
        width: '100%',
        boxSizing: 'border-box',
        overflow: 'hidden',
        backgroundColor: Colors.LIGHT_GRAY3,
      }}
    >
      <div
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Clock />
      </div>
    </div>
  )
}
