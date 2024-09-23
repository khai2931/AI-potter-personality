from llm_calls import get_llm_response

# CONTEXT_1 = "Assume you don't care at all about other people and that you are selfish. "
# CONTEXT_2 = "Assume you really love everyone and want to make everyone feel good. "
# CONTEXT_3 = "Assume you like to read books and enjoy intellectual discussions. "
# CONTEXT_4 = "Assume you are brave, couragous, and like to fight evil. "
CONTEXT_1 = "Cats are awesome. "
CONTEXT_2 = "Feel the burn baby! "
CONTEXT_3 = "Let's be history nerds. "
CONTEXT_4 = "Show me all the money. "

def get_similar_questions(prev_question: str, context: str) -> str:
  # input_str = "Generate a question different from \"" + prev_question + "\""
  input_str = "Generate a question relating to \"" + context + "\""
  # if prev_question is not None:
  #   input_str += ". The previous question was \"" + prev_question + "\""

  return get_llm_response(input_str)

def get_answer(question: str) -> str:
  return get_llm_response(question)

def get_question_and_answers(prev_question: str, context: str = None) -> (str, list[str]):
  question = get_similar_questions(prev_question, context)
  answers = []
  # 4 contexts for 4 different answers
  answers.append(get_answer(CONTEXT_1 + question))
  answers.append(get_answer(CONTEXT_2 + question))
  answers.append(get_answer(CONTEXT_3 + question))
  answers.append(get_answer(CONTEXT_4 + question))
  return question, answers

print("DEBUG: questions_answers.py initialized")

# question, answers = get_question_and_answers("What do you like to do in your free time?")
# print(question)
# print(answers)