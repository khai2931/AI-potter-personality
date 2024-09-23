import React from 'react';
import { postRequest } from './utils';

const NOT_SELECTED_COLOR = { backgroundColor: "#e5e7eb" }; 
const SELECTED_COLOR = { backgroundColor: "#4ade80" };
const MAX_QUESTIONS = 5

class QuestionsAnswers extends React.Component {
  constructor() {
    super();
    this.state = {
      question: "It's your first day at Hogwarts, what is the first thing that you do?",
      answer1: "Check out the awesome library",
      answer2: "Find new friends you can count on",
      answer3: "Look for peace and quiet",
      answer4: "Gossip and find all the secrets about everyone",
      chosen: 0,
      questionNum: 1,
      selected: [false, false, false, false, false]
    }
    this.updateState = this.updateState.bind(this);
  }
  render() {
    if (this.state.questionNum > MAX_QUESTIONS) {
      return (
        <div className="question-box">
          <h1>AI Harry Potter Quiz</h1>
          <h1>Your house is...uh oh we don't know!! LOL</h1>
        </div>
      );
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
        <button onClick={() => this.submitAnswer(this)}>Next</button>
        <p className="q-num">Question {this.state.questionNum} of {MAX_QUESTIONS}</p>
      </div>
    );
  }
  // "this" was changed to obj field to
  // fix weird bug where this was undefined
  submitAnswer(obj) {
    // only submit if answer chosen
    if (obj.state.chosen === 0) {
      alert("Choose an answer before proceeding!")
    } else {
      const ans1 = obj.state.answer1;
      const ans2 = obj.state.answer2;
      const ans3 = obj.state.answer3;
      const ans4 = obj.state.answer4;
      // special text input field case
      const ans5 = document.getElementById('ans5').value;
      obj.updateState(
        "Loading next question...\n...\n...\n...\n...\n",
        0,
        obj.state.questionNum
      );
      let chosenAnswer = '';
      console.log(obj.state.chosen);
      if (obj.state.chosen === 1) {
        chosenAnswer = ans1;
      } else if (obj.state.chosen === 2) {
        chosenAnswer = ans2;
      } else if (obj.state.chosen === 3) {
        chosenAnswer = ans3;
      } else if (obj.state.chosen === 4) {
        chosenAnswer = ans4;
      } else {
        chosenAnswer = ans5;
      } 
      const body = {
        question: obj.state.question,
        context: chosenAnswer
      };
      postRequest('http://localhost:8080/qs-as', obj.updateState,
                   JSON.stringify(body), 0, obj.state.questionNum + 1);
    }
  }
  backgroundColor(ansNum) {
    return this.state.selected[ansNum - 1] ? SELECTED_COLOR : NOT_SELECTED_COLOR;
  }
  selectAnswer(ansNum) {
    this.updateState(undefined, ansNum, undefined);
  }
  updateState(stringNewQsAs, ansNum, newQuestionNum) {
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
    if (typeof ansNum !== 'undefined') {
      // for ansNum = 0, nothing is selected and text box is cleared
      let newSelected = [false, false, false, false, false];
      if (ansNum > 0) {
        newSelected[ansNum - 1] = true;
      } else {
        document.getElementById('ans5').value = "";
      }
      this.setState({
        chosen : ansNum,
        selected : newSelected
      })
      // console.log("DEBUG: chosen answer is " + ansNum);
      // console.log("DEBUG: state chosen answer is " + this.state.chosen);
    }
    if (newQuestionNum) {
      this.setState({
        questionNum : newQuestionNum
      })
    }
  }
}

export default QuestionsAnswers;