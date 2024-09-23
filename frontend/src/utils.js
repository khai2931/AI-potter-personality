// makes an HTTP GET request to the url provided
// sends the response to the callback function
// that must accept a string param

export function getRequest(url, callback) {
  var http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === XMLHttpRequest.DONE) {
      // debug
      console.log("DEBUG getRequest()");
      console.log(http.responseText);
      callback(http.responseText, undefined, undefined);
    }
  }
  http.open("GET", url, true);
  http.send();
}

export function postRequest(url, callback, body, ansNum, newQuestionNum) {
  console.log("DEBUG: postRequest() body");
  console.log(body);
  var http = new XMLHttpRequest();
  http.onreadystatechange = function() {
    if (http.readyState === XMLHttpRequest.DONE) {
      console.log(http.responseText);
      callback(http.responseText, ansNum, newQuestionNum);
    }
  }
  http.open("POST", url, true);
  http.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  http.onload = () => {
    if (http.readyState === 4 && http.status === 201) {
      console.log(JSON.parse(http.responseText));
    } else {
      console.log(`Error: ${http.status}`);
    }
  };
  http.send(body);
}