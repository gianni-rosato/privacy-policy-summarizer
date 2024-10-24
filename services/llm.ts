interface OpenRouterResponse {
    choices: {
      message: {
        content: string;
      };
    }[];
  }
  
export async function getCompletion(prompt: string, policyContent: string, apiKey: string): Promise<string> {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "meta-llama/llama-3.1-70b-instruct:free",
        "messages": [
          {
            "role": "system",
            "content": `${prompt}`
          },
          {
            "role": "user",
            "content": `${policyContent}`
          }
        ],
        "top_p": 1,
        "temperature": 1,
        "repetition_penalty": 1,
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: OpenRouterResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting completion:', error);
    throw error;
  }
}