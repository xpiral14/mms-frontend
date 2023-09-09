export default function findContainment(element: Element, container: Element) {
  const object = {
    top: false,
    right: false,
    bottom: false,
    left: false,
  }
  /*
  Obtain the bounding rectangle for each element 
  */
  const boundingElementRect = element.getBoundingClientRect()
  const boundContainerRect = container.getBoundingClientRect()

  /* 
  If the boundaries of container pass through the boundaries of
  element then classifiy this as an overlap 
  */
  if (boundingElementRect.left < boundContainerRect.left && boundingElementRect.right > boundContainerRect.left) {
    object.left = true
  }
  if (boundingElementRect.left < boundContainerRect.right && boundingElementRect.right > boundContainerRect.right) {
    object.right = true
  }
  if (boundingElementRect.top < boundContainerRect.top && boundingElementRect.bottom > boundContainerRect.top) {
    object.top = true
  }
  if (boundingElementRect.top < boundContainerRect.bottom && boundingElementRect.bottom > boundContainerRect.bottom) {
    object.bottom = true
  }

  /* 
  If boundaries of element fully contained inside bounday of
  container, classify this as containment of element in container
  */
  if (
    boundingElementRect.left >= boundContainerRect.left &&
    boundingElementRect.top >= boundContainerRect.top &&
    boundingElementRect.bottom <= boundContainerRect.bottom &&
    boundingElementRect.right <= boundContainerRect.right
  ) {
    return {
      top: false,
      right: false,
      bottom: false,
      left: false,
    }
  }

  return object

}
