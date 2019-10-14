/*函数防抖*/
function debounce(func, interval) {
  var wait = interval || 1000;
  var timeout;
  return function () {
    let context = this;
    let args = arguments;
    if (timeout) clearTimeout(timeout);
    let callNow = !timeout;   
    timeout = setTimeout(() => {
      timeout = null;
    }, wait)
    if (callNow) func.apply(context, args)
  }
}

export default {
  debounce
};