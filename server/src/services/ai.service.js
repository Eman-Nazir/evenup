import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import logger from '../utils/logger.js';

// console.log("Gemini Key:", env.GEMINI_API_KEY);


const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const VALID_CATEGORIES = [
  'food', 'rent', 'transport', 'entertainment', 'utilities', 'shopping', 'other',
];


export const suggestCategory = async (description) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
    

    const prompt = `Classify this expense description into exactly one of these categories: ${VALID_CATEGORIES.join(', ')}.
Description: "${description}"
Respond with ONLY the category word, nothing else, no punctuation, no explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().toLowerCase();

    return VALID_CATEGORIES.includes(text) ? text : 'other';
  } catch (error) {
    logger.error('AI categorization failed, defaulting to "other":', error.message);
    return 'other';
  }
};