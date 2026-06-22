/**
 * Minimal chat client — designed for unit tests with mocked fetch.
 *
 * C# equivalent: IHttpClientFactory + typed client; tests use HttpMessageHandler mock.
 */

export type ChatMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

export type ChatCompletionResponse = {
  choices: Array<{ message: { content: string } }>;
};

export async function createChatCompletion(
  apiKey: string,
  messages: ChatMessage[],
  model = 'gpt-4o-mini',
): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as ChatCompletionResponse;
  const content = data.choices[0]?.message.content;

  if (!content) {
    throw new Error('OpenAI API returned no assistant content');
  }

  return content;
}
