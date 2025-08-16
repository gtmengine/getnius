// Helper function for mock data
export function getMockSuggestions() {
  return [
    {
      name: "Funding Amount",
      prompt: "Extract the total funding amount raised by the company in dollars"
    },
    {
      name: "Headquarters",
      prompt: "Extract the location of the company's headquarters"
    },
    {
      name: "Founding Year",
      prompt: "Extract the year the company was founded"
    },
    {
      name: "Employee Count",
      prompt: "Extract the approximate number of employees"
    },
    {
      name: "Tech Stack",
      prompt: "Identify the main technologies used by the company"
    }
  ]
}

// Generate suggestions using Mistral API
export async function generateWithMistral(apiKey: string, inputText: string) {
  const TEST_MODE = process.env.NODE_ENV === 'development' && 
                   process.env.MISTRAL_DRY_RUN === 'true'

  if (TEST_MODE) {
    console.log("[DRY RUN] Would send to Mistral:", {
      model: 'mistral-medium',
      input_length: inputText.length,
      first_100_chars: inputText.slice(0, 100)
    })
    return getMockSuggestions().slice(0, 3) // Return 3 mock suggestions for dry run
  }

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'mistral-medium',
      messages: [
        {
          role: 'system',
          content: `You are a market intelligence assistant. 
          Suggest 3 column names and prompts for extracting structured information from company descriptions.
          Respond ONLY with a JSON array in this format: 
          [{"name": "Column Name", "prompt": "Extraction prompt"}]`
        },
        {
          role: 'user',
          content: `Suggest data columns for these company descriptions:\n\n${inputText}`
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
      response_format: { type: 'json_object' }
    })
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(`Mistral API error: ${errorData.error?.message || response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content
  
  try {
    return JSON.parse(content)
  } catch (e) {
    console.error('Failed to parse Mistral response:', content)
    throw new Error('Invalid response format from Mistral API')
  }
}
