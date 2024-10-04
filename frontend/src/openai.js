import OpenAI from "openai";
const openai = new OpenAI();

export async function openAIRequest(url, callback, body, ansNum, newQuestionNum) {
  let params = JSON.parse(body);
  let query = "";
  if (url.endsWith('get-house')) {
    query = "Which of the 4 Harry Potter houses do I belong in: Gryffindor, Hufflepuff, Ravenclaw, or Slytherin? For context, I said that I \"" + params.context + "\"";
  } else if (url.endsWith('all-qs')) {
    if (params.adj !== "") {
      params.adj += " ";
    }
    if (params.about !== "") {
      params.about = "about " + params.about + " ";
    }
    query = "Create exactly 10 " + params.adj + "multiple-choice questions " + params.about + "to help the Sorting Hat sort someone in one of the four houses in Harry Potter. Format the questions in JSON with the keys \"question\", \"answer1\", \"answer2\", \"answer3\", and \"answer4\". Make sure each question is unique.";
  } else if (url.endsWith('get-sorting-hat')) {
    query = "Imagine you are the Sorting Hat in Harry Potter. Write a brief, one-sentence response of max 30 words to someone who said: " + "\"" + params.context + "\"";
  } else {
    alert("Invalid OpenAI Request");
    return null;
  }
  const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
              role: "user",
              content: query,
          },
      ],
  });

  const response = completion.choices[0].message.content;
  let ret = "";

  if (url.endsWith('all-qs')) {
    const parts = response.split("```");
    const json_text = (parts[1]).substring(4);  // cuts off "json" token
    ret = json_text;
  } else {
    ret = response;
  }

  callback(ret, ansNum, newQuestionNum);
}