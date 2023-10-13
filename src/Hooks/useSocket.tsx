import Echo from 'laravel-echo'
import { useMemo } from 'react'
import api from '../Config/api'
// import getCookie from '../Util/getCookie'
import { useAuth } from './useAuth'

export default function useSocket() {
  const { auth } = useAuth()

  const socket = useMemo(() => {
    let options: any = {
      broadcaster: 'pusher',
      key: import.meta.env.VITE_API_PUSHER_APP_KEY!,
      cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
      forceTLS: true,
    }
    if (auth?.token) {
      options = {
        ...options,
        authorizer: (channel: any) => {
          return {
            authorize: (socketId: string, callback: any) => {
              api
                .post('/broadcasting/auth', {
                  socket_id: socketId,
                  channel_name: channel.name,
                  notCamel: true,
                })
                .then((response) => {
                  callback(false, response.data)
                })
                .catch((error) => {
                  callback(true, error)
                })
            },
          }
        },
      }
    }
    return new Echo(options)
  }, [])

  return socket
}
