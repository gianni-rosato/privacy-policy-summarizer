import requests
import json

OPENROUTER_API_KEY = "YOUR_KEY_HERE"

response = requests.post(
  url="https://openrouter.ai/api/v1/chat/completions",
  headers={
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
  },
  data=json.dumps({
    "model": "meta-llama/llama-3.2-3b-instruct:free", # Optional
    "messages": [
      {"role": "user", "content": "What is the meaning of life?"}
    ],
    "top_p": 1,
    "temperature": 0.7,
    "frequency_penalty": 0,
    "presence_penalty": 0,
    "repetition_penalty": 1,
    "top_k": 0,
  })
)

print(response.json())

response_key_check = requests.get(
    "https://openrouter.ai/api/v1/auth/key",
    headers={
        "Authorization": f"Bearer {OPENROUTER_API_KEY}"
    }
)

print(response_key_check.json())
