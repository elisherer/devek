/**
 * Return the location of the element (x,y) being relative to the document.
 * 
 * @param {Element} element Element to be located
 */
function getElementPosition(element) {
  var curleft = 0, curtop = 0;
  if (element.offsetParent) {
      do {
          curleft += element.offsetLeft;
          curtop += element.offsetTop;
      } while ((element = element.offsetParent));
      return [curleft, curtop];
  }
  return undefined;
}

/** 
 * return the location of the click (or another mouse event) relative to the given element (to increase accuracy).
 * @param {DOM Event} event An event generate by an event listener.
 */
function getEventLocation(event){
  const pos = getElementPosition(event.target);
  return [
    event.pageX - pos[0],
    event.pageY - pos[1]
  ];
}

export default getEventLocation;