const rawUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
const API_BASE_URL = rawUrl.trim().replace(/\/$/, '');

/**
 * Sends a chat message and streams the response chunk-by-chunk.
 *
 * @param {string} question - The user's question.
 * @param {Array<{role: string, content: string}>} history - Conversation history.
 * @param {string|null} job_description - Optional job description context.
 * @param {(chunk: string) => void} onChunk - Callback invoked for each streamed text chunk.
 * @param {AbortSignal} [signal] - Optional abort signal to cancel the request.
 * @throws {Error} If the network request fails or the server returns a non-OK status.
 */
export async function sendChatMessageStream(question, history = [], job_description = null, onChunk, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history, job_description }),
      signal, // Pass the abort signal to fetch
    });
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') throw networkErr;
    console.error('Network/CORS error reaching backend:', networkErr);
    throw new Error(`Unable to connect to server at ${API_BASE_URL}. Please check your network connection or CORS configuration.`, { cause: networkErr });
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Server returned ${response.status}: ${errorText || response.statusText}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // Ensure { stream: true } so multi-byte unicode chars aren't split across chunks
      const chunk = decoder.decode(value, { stream: true });
      if (chunk && onChunk) {
        onChunk(chunk);
      }
    }
    
    // Flush the final bytes
    const finalChunk = decoder.decode();
    if (finalChunk && onChunk) {
      onChunk(finalChunk);
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Sends a job description to the backend to get a structured JSON match analysis.
 *
 * @param {string} job_description - The job description text.
 * @param {AbortSignal} [signal] - Optional abort signal.
 * @returns {Promise<Object>} The JSON response with score, strengths, missing_skills, recommendation, and reason.
 */
export async function analyzeJobMatch(job_description, signal) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/chat/job-match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ job_description }),
      signal,
    });
  } catch (networkErr) {
    if (networkErr.name === 'AbortError') throw networkErr;
    console.error('Network/CORS error during job match:', networkErr);
    throw new Error(`Unable to connect to server at ${API_BASE_URL}. Please check network or CORS settings.`, { cause: networkErr });
  }

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Job Match API error (${response.status}): ${errorText || response.statusText}`);
  }

  return response.json();
}
