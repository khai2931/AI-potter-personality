import React from 'react';
import { getRequest } from './utils';
import { EMPTY_SELECTION } from './const';

var INITIALIZED = false;

class QuestionsAnswers extends React.Component {
  constructor() {
    super();
    this.state = {
      question: "Quiz is now loading...",
      answer1: "...",
      answer2: "...",
      answer3: "...",
      answer4: "...",
      qNum: 1,
      selected: EMPTY_SELECTION
    }
    this.updateState = this.updateState.bind(this);
  }
  render() {
    if (!INITIALIZED) {
      INITIALIZED = true;
      getRequest('http://localhost:8080/qs-as', this.updateState);
    }
    return (
      <div class="question-box">
        <h1>AI Harry Potter Quiz</h1>
        <div class="question">
          <p>{this.state.question}</p>
        </div>
        <div class="answers">
          <p class="answer">{this.state.answer1}</p>
          <p class="answer">{this.state.answer2}</p>
          <p class="answer">{this.state.answer3}</p>
          <p class="answer">{this.state.answer4}</p>
          <input class="answer" type="text" placeholder="Type your own answer..."/>
        </div>
        <button>Next</button>
        <p class="q-num">Question {this.state.qNum} of 7</p>
      </div>
    );
  }
  updateState(stringNewQsAs, newSelected) {
    const newQsAs = stringNewQsAs.split('\n');
    this.setState({
      question : newQsAs[0],
      answer1 : newQsAs[1],
      answer2 : newQsAs[2],
      answer3 : newQsAs[3],
      answer4 : newQsAs[4],
      selected : newSelected
    })
  }
}

export default QuestionsAnswers;