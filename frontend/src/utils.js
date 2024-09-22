// makes an HTTP GET request to the url provided
// sends the response to the callback function
// that must accept a string param
import { EMPTY_SELECTION } from "./const";

export function getRequest(url, callback) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === XMLHttpRequest.DONE) {
      // debug
      console.log("DEBUG getRequest()");
      console.log(http.responseText);
      callback(http.responseText, EMPTY_SELECTION);
    }
  }
  http.open("GET", url, true);
  http.send();
}