import { Intent } from '@blueprintjs/core'

export type ShowTypes = 'toast' | 'alert'

export type ShowErrormessageOptions = {
  showOn?: ShowTypes;
  intent?: Intent
}

export type UseMessageErrorReturn = {
  showErrormessage: (
    error: any,
    defaultMessage: string,
    options?: ShowErrormessageOptions
  ) => void
}
