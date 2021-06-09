export function buildMenu(object: object) {
  const objectArray = Object.values(object)
  const array: any[] = []
  const menuObject: any = {}

  objectArray.forEach((objValue) => {
    menuObject.name = objValue.name

    if (objValue.items) {
      menuObject.items = buildMenu(objValue.items)
      array.push(menuObject)
      return
    }

    menuObject.screen = objValue.screen
    array.push(menuObject)
  })

  return array
}
