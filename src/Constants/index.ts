export const AUTH_LOCAL_STORAGE_KEY = '@auth'
export const IS_DEVELOPMENT_MODE = import.meta.env.MODE === 'development'
export const USER_TIMEZONE_OFFSET = new Date().getTimezoneOffset()
export const USER_TIMEZONE_NAME = Intl.DateTimeFormat().resolvedOptions().timeZone
