import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a high-speed, live Referee Assistant for Flag Football following NIRSA rules.
Your goal is to process transcriptions of a live "referee call" or rule query, analyze it against flag football regulations, and return a structured text answer.

Key Rules to enforce:
- Penalty Classes: 5-yard (e.g., False Start, Illegal Motion, Offsides) vs 10-yard (e.g., Flag Guarding, Pass Interference, Unsportsmanlike Conduct).
- Spot Enforcement: "All-but-one" principle or "Previous Spot".

Response Format Restrictions:
You must ONLY output a strict markdown format with the following keys. Do not include introductory text or follow-up questions.
FOUL: [Name of the foul]
ENFORCEMENT: [Yardage penalty and enforcement spot]
DOWN: [Repeat down or loss of down]
CLOCK: [Status of the clock]`;

// In-memory session store (resets per function cold start — acceptable for short chats)
const sessionHistory = new Map();

async function fetchWithRetry(apiCall, retries = 3, baseDelayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        const delay = baseDelayMs * Math.pow(2, i) + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

export async function handler(event) {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // Parse the incoming request body
    let text = null;
    let sessionId = 'default-session';
    let audioBase64 = null;

    const contentType = event.headers['content-type'] || '';

    if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data manually
      const boundary = contentType.split('boundary=')[1];
      const parts = parseMultipart(event.body, boundary, event.isBase64Encoded);

      text = parts.text || null;
      sessionId = parts.sessionId || 'default-session';
      audioBase64 = parts.audioBuffer || null;
    } else {
      // JSON body
      const body = JSON.parse(event.body || '{}');
      text = body.text || null;
      sessionId = body.sessionId || 'default-session';
    }

    let queryText = text;

    // 1. Handle Speech-to-Text if audio is provided
    if (audioBase64) {
      // Groq SDK accepts a File-like object for serverless environments
      const audioFile = new File([audioBase64], 'query.webm', { type: 'audio/webm' });

      const transcription = await fetchWithRetry(() =>
        groq.audio.transcriptions.create({
          file: audioFile,
          model: 'whisper-large-v3-turbo',
          response_format: 'text',
        })
      );

      queryText = transcription;
    }

    if (!queryText) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing text or audio query' }),
      };
    }

    // 2. Session history management
    if (!sessionHistory.has(sessionId)) {
      sessionHistory.set(sessionId, [{ role: 'system', content: SYSTEM_PROMPT }]);
    }
    const history = sessionHistory.get(sessionId);

    if (history.length > 7) {
      history.splice(1, 2);
    }

    history.push({ role: 'user', content: queryText });

    // 3. LLM inference
    const completion = await fetchWithRetry(() =>
      groq.chat.completions.create({
        messages: history,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.0,
      })
    );

    const assistantResponse = completion.choices[0]?.message?.content || '';
    history.push({ role: 'assistant', content: assistantResponse });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        transcription: audioBase64 ? queryText : null,
        response: assistantResponse,
      }),
    };
  } catch (error) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to process referee query',
        error: error.message,
      }),
    };
  }
}

/**
 * Minimal multipart/form-data parser for Netlify functions.
 * Returns an object with text fields and the first file as a Buffer.
 */
function parseMultipart(body, boundary, isBase64Encoded) {
  const result = {};
  const rawBody = isBase64Encoded
    ? Buffer.from(body, 'base64')
    : Buffer.from(body, 'binary');

  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const parts = [];
  let start = indexOf(rawBody, boundaryBuffer, 0);

  while (start !== -1) {
    const nextStart = indexOf(rawBody, boundaryBuffer, start + boundaryBuffer.length);
    if (nextStart === -1) break;
    parts.push(rawBody.slice(start + boundaryBuffer.length, nextStart));
    start = nextStart;
  }

  for (const part of parts) {
    const headerEnd = indexOf(part, Buffer.from('\r\n\r\n'), 0);
    if (headerEnd === -1) continue;

    const headerStr = part.slice(0, headerEnd).toString('utf-8');
    const content = part.slice(headerEnd + 4, part.length - 2); // strip trailing \r\n

    const nameMatch = headerStr.match(/name="([^"]+)"/);
    if (!nameMatch) continue;
    const fieldName = nameMatch[1];

    const filenameMatch = headerStr.match(/filename="([^"]+)"/);
    if (filenameMatch) {
      // File field — store as Buffer
      result.audioBuffer = content;
    } else {
      // Text field
      result[fieldName] = content.toString('utf-8');
    }
  }

  return result;
}

function indexOf(buf, search, offset) {
  for (let i = offset; i <= buf.length - search.length; i++) {
    let found = true;
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) {
        found = false;
        break;
      }
    }
    if (found) return i;
  }
  return -1;
}
