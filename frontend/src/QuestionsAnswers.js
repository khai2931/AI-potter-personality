import React from 'react';
import { getRequest } from './utils';

const NOT_SELECTED_COLOR = { backgroundColor: "#e5e7eb" }; 
const SELECTED_COLOR = { backgroundColor: "#4ade80" };

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
      chosen: undefined,
      questionNum: 1,
      selected: [false, false, false, false, false]
    }
    this.updateState = this.updateState.bind(this);
  }
  render() {
    if (!INITIALIZED) {
      INITIALIZED = true;
      getRequest('http://localhost:8080/qs-as', this.updateState);
    }
    
    return (
      <div className="question-box">
        <h1>AI Harry Potter Quiz</h1>
        <div className="question">
          <p>{this.state.question}</p>
        </div>
        <div className="answers">
          <p id="ans1" style={this.backgroundColor(1)} className="answer" onClick={() => this.selectAnswer(1)}>{this.state.answer1}</p>
          <p id="ans2" style={this.backgroundColor(2)} className="answer" onClick={() => this.selectAnswer(2)}>{this.state.answer2}</p>
          <p id="ans3" style={this.backgroundColor(3)} className="answer" onClick={() => this.selectAnswer(3)}>{this.state.answer3}</p>
          <p id="ans4" style={this.backgroundColor(4)} className="answer" onClick={() => this.selectAnswer(4)}>{this.state.answer4}</p>
          <input id="ans5" style={this.backgroundColor(5)} className="answer" onClick={() => this.selectAnswer(5)} type="text" placeholder="Type your own answer..."/>
        </div>
        <button>Next</button>
        <p className="q-num">Question {this.state.qNum} of 7</p>
      </div>
    );
  }
  backgroundColor(ansNum) {
    return this.state.selected[ansNum - 1] ? SELECTED_COLOR : NOT_SELECTED_COLOR;
  }
  selectAnswer(ansNum) {
    this.updateState(undefined, ansNum);
  }
  updateState(stringNewQsAs, ansNum) {
    if (stringNewQsAs) {
      const newQsAs = stringNewQsAs.split('\n');
      this.setState({
        question : newQsAs[0],
        answer1 : newQsAs[1],
        answer2 : newQsAs[2],
        answer3 : newQsAs[3],
        answer4 : newQsAs[4]
      })
    }
    if (ansNum) {
      let newSelected = [false, false, false, false, false];
      newSelected[ansNum - 1] = true;
      this.setState({
        chosen : ansNum,
        selected : newSelected
      })
      console.log("DEBUG: chosen answer is " + ansNum);
    }
  }
}

export default QuestionsAnswers;