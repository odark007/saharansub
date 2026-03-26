import express from 'express';
import multer from 'multer';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';
import os from 'os';

const router = express.Router();

// Initialize Groq client
// It automatically picks up GROQ_API_KEY from environment variables
const groq = new Groq();

// Multer setup for handling file uploads
// We'll save temporarily to disk because Groq's SDK prefers a file stream with a known filename/path
const upload = multer({ dest: os.tmpdir() });

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

// In-memory simple store for short-term history (last 3 calls per user)
// In production, use Redis or database keyed by a session ID
const sessionHistory = new Map();

// Helper for exponential backoff retry for Groq API calls
async function fetchWithRetry(apiCall, retries = 3, baseDelayMs = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        const delay = (baseDelayMs * Math.pow(2, i)) + Math.random() * 500;
        console.log(`Rate limited by Groq API. Retrying in ${delay.toFixed(0)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

router.post('/', upload.single('audio'), async (req, res) => {
  try {
    const { text, sessionId = 'default-session' } = req.body;
    let queryText = text;

    // 1. Handle Speech-to-Text if audio is provided
    if (req.file) {
      console.log('Received audio file:', req.file.path, req.file.mimetype);
      // Validate file size limit (< 25MB)
      if (req.file.size > 25 * 1024 * 1024) {
        return res.status(400).json({ error: 'Audio file must be under 25MB' });
      }

      // We need to send a readable stream with an explicit filename ending with a suitable extension
      // Groq STT expects the filename to have an extension to infer the format
      const tempExtPath = req.file.path + '.wav';
      fs.renameSync(req.file.path, tempExtPath);

      const transcription = await fetchWithRetry(() =>
        groq.audio.transcriptions.create({
          file: fs.createReadStream(tempExtPath),
          model: 'whisper-large-v3-turbo',
          response_format: 'text',
        })
      );

      // Clean up the temporary file
      fs.unlinkSync(tempExtPath);
      
      queryText = transcription;
      console.log('Transcription result:', queryText);
    }

    if (!queryText) {
      return res.status(400).json({ error: 'Missing text or audio query' });
    }

    // 2. State Management for Chat History
    if (!sessionHistory.has(sessionId)) {
      sessionHistory.set(sessionId, [
        { role: 'system', content: SYSTEM_PROMPT }
      ]);
    }
    const history = sessionHistory.get(sessionId);

    // Keep history tight: System Prompt (1) + last 3 turns (3 user + 3 assistant = 6)
    if (history.length > 7) {
      // Remove oldest user/assistant pair
      history.splice(1, 2);
    }

    history.push({ role: 'user', content: queryText });

    // 3. Inference using LLM
    const completion = await fetchWithRetry(() =>
      groq.chat.completions.create({
        messages: history,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.0,
      })
    );

    const assistantResponse = completion.choices[0]?.message?.content || '';
    
    // Add to history
    history.push({ role: 'assistant', content: assistantResponse });

    res.json({
      transcription: req.file ? queryText : null,
      response: assistantResponse,
    });
  } catch (error) {
    console.error('Error processing Groq Chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process referee query',
      error: error.message
    });
  }
});

export default router;
