import {addMinutes} from 'date-fns'
export default  function getDateWithTz(date: Date){
  return addMinutes(date, date.getTimezoneOffset())
}
