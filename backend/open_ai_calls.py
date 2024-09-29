from openai import OpenAI
client = OpenAI()

def get_openai_response(input_text: str) -> str:
  # DEBUG
  print("Now calling the OpenAI model with this query: ")
  print(input_text)
  print()

  completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": input_text
        }
    ]
  )
  return str(completion.choices[0].message.content)

print("DEBUG: open_ai_calls.py initialized")

