from transformers import T5Tokenizer, T5ForConditionalGeneration

# download the model first into the directory MODEL_PATH
# change just this variable
MODEL_NAME = "google/flan-t5-small"
MODEL_PATH = "./models/" + MODEL_NAME

tokenizer = T5Tokenizer.from_pretrained(MODEL_PATH)
model = T5ForConditionalGeneration.from_pretrained(MODEL_PATH)

def get_llm_response(input_text: str) -> str:
  input_ids = tokenizer(input_text, return_tensors="pt").input_ids

  outputs = model.generate(input_ids, max_new_tokens=20)
  return tokenizer.decode(outputs[0], skip_special_tokens=True)

questions = [
  "Ask a personal question about someone who is an introvert",
  "Ask a question about my personality",
  "Somebody is an introvert. Ask them a question.",
  "Imagine that you are kind and loyal. How would you treat your friends that betrayed you?",
  "Imagine that you are mean and disloyal. How would you treat your friends that betrayed you?"
]

# for question in questions:
#   print(get_llm_response(question))