import React from 'react';

var INITIALIZED = false;

class QuestionsAnswers extends React.Component {
  constructor() {
    super();
    this.state = {
      question: "Quiz is now loading...",
      answer1: "...",
      answer2: "...",
      answer3: "...",
      answer4: "..."
    }
    this.updateState = this.updateState.bind(this);
  }
  render() {
    if (!INITIALIZED) {
      INITIALIZED = true;
      this.getNextQuestionAnswers(this.updateState);
    }
    return (
      <div>
        <h3>{this.state.question}</h3>
        <p>{this.state.answer1}</p>
        <p>{this.state.answer2}</p>
        <p>{this.state.answer3}</p>
        <p>{this.state.answer4}</p>
      </div>
    );
  }
  updateState(newQsAs) {
    this.setState({
      question : newQsAs[0],
      answer1 : newQsAs[1],
      answer2 : newQsAs[2],
      answer3 : newQsAs[3],
      answer4 : newQsAs[4]
    })
  }
  getNextQuestionAnswers(callback) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function() {
      if (http.readyState === XMLHttpRequest.DONE) {
          // debug
          console.log("DEBUG B");
          console.log(http.responseText);
          const newQsAs = http.responseText.split('\n')
          callback(newQsAs);
      }
    }
    const url='http://localhost:8080/qs-as';
    http.open("GET", url, true);
    http.send();
  }
}

export default QuestionsAnswers;

// var outputString = "IF YOU SEE THIS, IT DIDN'T WORK";

// function getQuestionsAnswers(prevQ, context) {
//   getRequest(saveText);
//   // debug
//   console.log("DEBUG A");
//   console.log(outputString);
//   return outputString;
// };

// function saveText(str) {
//   outputString = str;
//   // debug
//   console.log("DEBUG: TEXT SAVED AS");
//   console.log(outputString);
// }

// function getRequest(callback) {
//   var http = new XMLHttpRequest();
//   http.onreadystatechange = function() {
//     if (http.readyState === XMLHttpRequest.DONE) {
//         // debug
//         console.log("DEBUG B");
//         console.log(http.responseText);
//         callback(http.responseText);
//     }
//   }
//   const url='http://localhost:8080/qs-as';
//   http.open("GET", url, true);
//   http.send();
// };