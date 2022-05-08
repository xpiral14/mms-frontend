export default function makeURL(...params: (string|number)[]){
  return params.join('/')
}
