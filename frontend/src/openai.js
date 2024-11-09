import OpenAI from "openai";
const openai = new OpenAI( {apiKey: `${process.env.REACT_APP_OPENAI_API_KEY}`, dangerouslyAllowBrowser: true} );

export async function openAIRequest(url, callback, body, ansNum, newQuestionNum) {
  let params = JSON.parse(body);
  let query = "";
  if (url.endsWith('get-house')) {
    query = params.eval + " For context, I said that I \"" + params.context + "\"";
  } else if (url.endsWith('all-qs')) {
    query = params.adj;
  } else if (url.endsWith('get-sorting-hat')) {
    query = params.character + " Write a brief, one-sentence response of max 30 words to someone who answered the question: \"" + params.question + "\" by saying \"" + params.context + "\"";
  } else {
    alert("Invalid OpenAI Request");
    return null;
  }
  console.log("QUERY: " + query);
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