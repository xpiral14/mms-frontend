import {addMinutes} from 'date-fns'
export default  function getDateWithTz(date: Date|string){
  if(typeof date === 'string'){
    date = new Date(date)
  }

  return addMinutes(date, date.getTimezoneOffset())
}
