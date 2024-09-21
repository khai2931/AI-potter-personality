from llm_calls import get_llm_response

def get_similar_questions(prev_question: str, context: str = None) -> str:
  input_str = "Generate a question different from \"" + prev_question + "\""
  if context is not None:
    input_str += ". For context, " + context

  return get_llm_response(input_str)

def get_answer(question: str) -> str:
  return get_llm_response(question)

def get_question_and_answers(prev_question: str, context: str = None) -> (str, list[str]):
  question = get_similar_questions(prev_question, context)
  answers = []
  for i in range(4):
    answers.append(get_answer(question))
  return question, answers

print("DEBUG: questions_answers.py initialized")

# question, answers = get_question_and_answers("What do you like to do in your free time?")
# print(question)
# print(answers)