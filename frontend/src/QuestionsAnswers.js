import React from 'react';
// import { postRequest } from './utils';
import sortingHat from './img/sorting_hat.png';
import { openAIRequest } from './openai';

const NOT_SELECTED_COLOR = { backgroundColor: "#e5e7eb" };
const SELECTED_COLOR = { backgroundColor: "#4ade80" };
const MAX_QUESTIONS = 10
// const SERVER = "http://54.156.81.41:8080/";
const SERVER = "http://localhost:8080/";

var determinedHouse = false;

class QuestionsAnswers extends React.Component {
  constructor() {
    super();
    this.state = {
      question: "The Sorting Hat is thinking about what questions to ask you...",
      answer1: "...",
      answer2: "...",
      answer3: "...",
      answer4: "...",
      chosen: 0,
      questionNum: 0,  // question 0 is choosing the type of question; the rest are the quiz q's
      selected: [false, false, false, false, false],
      house: "",
      hatDialogue: "Oh you may not think I'm pretty, But don't judge on what you see, I'll eat myself if you can find. A smarter hat than me.",
      overallContext: "",
      adj: "",
      about: "",
      questionJSON: ""
    }
    this.updateState = this.updateState.bind(this);
    this.updateHouse = this.updateHouse.bind(this);
    this.updateContext = this.updateContext.bind(this);
    this.updateHat = this.updateHat.bind(this);
    this.updateQuestions = this.updateQuestions.bind(this);
    this.advanceQuestion = this.advanceQuestion.bind(this);
  }
  render() {
    if (this.state.questionNum === 0) {
      return (
        <div className="question-box">
          <h1>AI Harry Potter Quiz</h1>
          <div id="sort-convo">
            <img id="sorting-hat" src={sortingHat} alt="sorting hat"></img>
            <div id="text-bubble">
              <p>{this.state.hatDialogue}</p>
            </div>
          </div>
          I want some
          <input id="adj" className="starter" type="text" list="adj-data" placeholder="(type in adjectives)"/>
          <datalist id="adj-data">
            <option value="dark, twisted, psychological"></option>
            <option value="lighthearted, funny"></option>
            <option value="passionate, dramatic"></option>
          </datalist>
          questions about
          <input id="topic" className="starter" type="text" list="topics-data" placeholder="(type in topic)"/>
          <datalist id="topics-data">
            <option value="Harry Potter"></option>
            <option value="going to the beach"></option>
            <option value="love triangles"></option>
            <option value="crytocurrencies"></option>
            <option value="random, obscure topics"></option>
          </datalist><br></br><br></br>
          <button onClick={() => this.updateQuestionType(this)}>Next</button><br></br>
          <footer>
            <p>Made with ❤️ by <a href="https://www.linkedin.com/in/khai2931/" target="_blank" rel="noreferrer">Khai-Huy Alex Nguyen</a></p>
          </footer>
        </div>
      );
    } else if (this.state.questionNum > MAX_QUESTIONS) {
      // trim off trailing ", "
      if (!determinedHouse) {
        // console.log("DEBUG: this.state.overallContext\n" + this.state.overallContext);
        const overallContext = this.state.overallContext.substring(0, this.state.overallContext.length - 2);
        this.getFinalHouse(overallContext, this)
        determinedHouse = true;
      }
      return (
        <div className="question-box">
          <h1>AI Harry Potter Quiz</h1>
          <h1>Your house is...</h1>
          <p dangerouslySetInnerHTML={{__html: this.state.house}}></p><br></br>
          <a href="/" className="btn">Take another quiz!</a>
          <footer>
            <p>Made with ❤️ by <a href="https://www.linkedin.com/in/khai2931/" target="_blank" rel="noreferrer">Khai-Huy Alex Nguyen</a></p>
          </footer>
        </div>
      );
    }
    return (
      <div className="question-box">
        <h1>AI Harry Potter Quiz</h1>
        <div id="sort-convo">
          <img id="sorting-hat" src={sortingHat} alt="sorting hat"></img>
          <div id="text-bubble">
            <p>{this.state.hatDialogue}</p>
          </div>
        </div>
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
        <p className="q-num">Question {this.state.questionNum} of {MAX_QUESTIONS}</p><br></br>
      </div>
    );
  }
  getFinalHouse(overallContextFinal, obj) {
    const body = {
      context: overallContextFinal
    };
    openAIRequest(SERVER + 'get-house', obj.updateHouse,
                 JSON.stringify(body), 0, obj.state.questionNum + 1);
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
      const overallContext = obj.state.overallContext;
      // console.log("DEBUG: overallContext");
      // console.log(overallContext);
      obj.updateState(
        "Loading next question...\n...\n...\n...\n...\n",
        0,
        obj.state.questionNum
      );
      let chosenAnswer = '';
      // console.log("Chosen Answer" + obj.state.chosen);
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
        context: chosenAnswer,
        adj: obj.state.adj,
        about: obj.state.about
      };

      // add to overall context to help pick house at the end
      obj.updateContext(overallContext + chosenAnswer + ", ");
      if (obj.state.questionNum < MAX_QUESTIONS) {
        obj.advanceQuestion(obj.state.questionNum + 1);
      } else {
        obj.updateState(undefined, undefined, MAX_QUESTIONS + 1);
      }
      openAIRequest(SERVER + 'get-sorting-hat', obj.updateHat,
                   JSON.stringify(body), 0, obj.state.questionNum + 1);
    }
  }
  backgroundColor(ansNum) {
    return this.state.selected[ansNum - 1] ? SELECTED_COLOR : NOT_SELECTED_COLOR;
  }
  selectAnswer(ansNum) {
    this.updateState(undefined, ansNum, undefined);
  }
  updateQuestionType(obj) {
    obj.updateHat("Are you afraid of what you'll hear?\nAfraid I'll speak the name you fear?\nDon't worry, child, I know my job,\nYou'll learn to laugh, if first you sob.");
    const adj = document.getElementById('adj').value;
    const topic = document.getElementById('topic').value;
    obj.setState({
      adj : adj,
      about : topic,
      questionNum : 1
    })
    const body = {
      adj: adj,
      about: topic
    };
    openAIRequest(SERVER + 'all-qs', obj.updateQuestions,
      JSON.stringify(body), 0, 1);
  }
  // removes house from string
  removeHouse(str) {
    str = str.replace("(Gryffindor)", "");
    str = str.replace("(Hufflepuff)", "");
    str = str.replace("(Ravenclaw)", "");
    str = str.replace("(Slytherin)", "");
    return str.trim();
  }
  // sets all questions and sets up first question
  updateQuestions(jsonQs, unusedA, unusedB) {  // see below for unusedA and unused B
    const questions = JSON.parse(jsonQs);
    // clean up questions with answers that have (Gryffindor), (Hufflepuff), etc.
    for (let i = 0; i < questions.length; i++) {
      questions[i].answer1 = this.removeHouse(questions[i].answer1);
      questions[i].answer2 = this.removeHouse(questions[i].answer2);
      questions[i].answer3 = this.removeHouse(questions[i].answer3);
      questions[i].answer4 = this.removeHouse(questions[i].answer4);
    }
    this.setState({
      questionJSON : questions,
      question : questions[0].question,
      answer1 : questions[0].answer1,
      answer2 : questions[0].answer2,
      answer3 : questions[0].answer3,
      answer4 : questions[0].answer4
    });
  }
  advanceQuestion(qNum) {
    const questions = this.state.questionJSON;
    this.setState({
      question : questions[qNum - 1].question,
      answer1 : questions[qNum - 1].answer1,
      answer2 : questions[qNum - 1].answer2,
      answer3 : questions[qNum - 1].answer3,
      answer4 : questions[qNum - 1].answer4,
      questionNum : qNum
    })
  }
  updateHat(hatResponse, unusedA, unusedB) {  // see below for unusedA and unused B
    this.setState({
      hatDialogue : hatResponse
    })
  }
  updateContext(newContext) {
    this.setState({
      overallContext : newContext
    })
  }
  updateHouse(houseFinal, unusedA, unusedB) {  // unusedA and unsued B are to accomodate for the callback
                                               // in utils.js throwing 3 params
    this.setState({
      house : houseFinal
    })
  }
  updateState(stringNewQsAs, ansNum, newQuestionNum) {
    if (stringNewQsAs != null && stringNewQsAs) {
      const newQsAs = stringNewQsAs.split('\n');
      this.setState({
        question : newQsAs[0],
        answer1 : newQsAs[1],
        answer2 : newQsAs[2],
        answer3 : newQsAs[3],
        answer4 : newQsAs[4]
      })
    }
    if (ansNum != null && typeof ansNum !== 'undefined') {
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