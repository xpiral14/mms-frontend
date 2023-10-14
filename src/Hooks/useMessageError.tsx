import { useCallback } from 'react'
import {
  ShowErrormessageOptions,
  UseMessageErrorReturn,
} from '../Contracts/Hooks/useErrorMessage'
import { useAlert } from './useAlert'
import { useToast } from './useToast'

export default function useMessageError(): UseMessageErrorReturn {
  const { showErrorToast } = useToast()
  const { openAlert } = useAlert()
  const formatObjectErrorToMessageError = (error: Record<string, any>) => {
    if (error.data?.messages) {
      if(typeof error.data.messages === 'string') {
        return error.data?.messages
      }
      const messages = Object.values(error.data?.messages)
      if (messages.length > 1)
        return (
          <ul>
            {messages.map((message: any) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        )

      return messages?.[0]
    }

    return error.data?.message
  }

  const showErrorMessage = useCallback(
    (
      error: any,
      defaultErrorMessage?: string,
      options: ShowErrormessageOptions = {showOn: 'toast' }
    ) => {
      const errorData = error?.response?.data
      if (!errorData) return

      let errorMessageToShow: string | JSX.Element = ''
      switch (typeof errorData) {
      case 'string':
        errorMessageToShow = errorData
        break
      case 'object':
        errorMessageToShow = formatObjectErrorToMessageError(errorData)
      }

      if (!errorMessageToShow && !defaultErrorMessage) return

      switch (options?.showOn) {
      case 'alert':
        openAlert({
          text: errorMessageToShow,
          intent: options?.intent,
        })
        break
      case 'toast':
        showErrorToast({
          message: errorMessageToShow,
          intent: options?.intent,
        })
      }
    },
    []
  )

  return { showErrorMessage: showErrorMessage }
}
