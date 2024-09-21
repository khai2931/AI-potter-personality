import requests

# API_URL = "https://api-inference.huggingface.co/models/distilbert/distilgpt2"
API_URL = "https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B"
headers = {"Authorization": "Bearer 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"}

payload = {
    "inputs": "Can you please let us know more details about your ",
}

response = requests.post(API_URL, headers=headers, json=payload)
print(response.json())