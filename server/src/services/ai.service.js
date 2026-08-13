import { GoogleGenAI } from '@google/genai';
import env from '../config/env.js';
import logger from '../utils/logger.js';

const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const VALID_CATEGORIES = [
  'food', 'rent', 'transport', 'entertainment', 'utilities', 'shopping', 'other',
];

export const suggestCategory = async (description) => {
  try {
    const prompt = `Classify this expense description into exactly one of these categories: ${VALID_CATEGORIES.join(', ')}.
Description: "${description}"
Respond with ONLY the category word, nothing else, no punctuation, no explanation.`;

    const result = await genAI.models.generateContent({
      model: env.GEMINI_MODEL || 'gemini-flash-latest',
      contents: prompt,
    });

    const text = result.text.trim().toLowerCase();

    return VALID_CATEGORIES.includes(text) ? text : 'other';
  } catch (error) {
    logger.error('AI categorization failed, defaulting to "other":', error.message);
    return 'other';
  }
};