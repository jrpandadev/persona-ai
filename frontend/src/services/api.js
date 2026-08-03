const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/**
 * Sends a chat message and streams the response chunk-by-chunk.
 *
 * @param {string} question - The user's question.
 * @param {Array<{role: string, content: string}>} history - Conversation history.
 * @param {(chunk: string) => void} onChunk - Callback invoked for each streamed text chunk.
 * @throws {Error} If the network request fails or the server returns a non-OK status.
 */
export async function sendChatMessageStream(question, history = [], job_description = null, onChunk) {
  const response = await fetch(`${API_BASE_URL}/chat/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history, job_description }),
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status} ${response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    if (chunk && onChunk) {
      onChunk(chunk);
    }
  }
}

/**
 * Sends a job description to the backend to get a structured JSON match analysis.
 *
 * @param {string} job_description - The job description text.
 * @returns {Promise<Object>} The JSON response with score, strengths, missing_skills, recommendation, and reason.
 */
export async function analyzeJobMatch(job_description) {
  const response = await fetch(`${API_BASE_URL}/chat/job-match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ job_description }),
  });

  if (!response.ok) {
    throw new Error(`Job Match API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
