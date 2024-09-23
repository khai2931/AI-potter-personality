from transformers import T5Tokenizer, T5ForConditionalGeneration
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# if set true, uses an offline model downloaded in ../models/
# otherwise, downloads the model from huggingface
USE_OFFLINE = True
IS_T5 = True
SAVE_MODEL = False

# if using offline, download the model first into the directory MODEL_PATH
# MUST RUN FROM the backend directory (not root)
# (e.g. into "models/google/flan-t5-small" for "google/flan-t5-small")

MODEL_NAME = "google/flan-t5-small"
# MODEL_NAME = "Babelscape/rebel-large"
MODEL_PATH = "../models/" + MODEL_NAME


if USE_OFFLINE:
  model = MODEL_PATH
else:
  model = MODEL_NAME

if IS_T5:
  tokenizer = T5Tokenizer.from_pretrained(model)
  model = T5ForConditionalGeneration.from_pretrained(model)
else:
  tokenizer = AutoTokenizer.from_pretrained(model)
  model = AutoModelForSeq2SeqLM.from_pretrained(model) 

if SAVE_MODEL:
  tokenizer.save_pretrained(MODEL_PATH)
  model.save_pretrained(MODEL_PATH)


def get_llm_response(input_text: str) -> str:
  # DEBUG
  print("Now calling the LLM with this query: ")
  print(input_text)
  print()
  input_ids = tokenizer(input_text, return_tensors="pt").input_ids

  outputs = model.generate(input_ids, max_new_tokens=20)
  return tokenizer.decode(outputs[0], skip_special_tokens=True)

print("DEBUG: llm_calls.py initialized")
# questions = [
#   "Ask a personal question about someone who is an introvert",
#   "Ask a question about my personality",
#   "Somebody is an introvert. Ask them a question.",
#   "Imagine that you are kind and loyal. How would you treat your friends that betrayed you?",
#   "Imagine that you are mean and disloyal. How would you treat your friends that betrayed you?"
# ]

# for question in questions:
#   print(get_llm_response(question))