import toHHMMSS from './toHHMMSS'

export default function getDateFromSeconds(seconds: number) {
  return new Date('2021-01-01' + toHHMMSS(seconds))
}
