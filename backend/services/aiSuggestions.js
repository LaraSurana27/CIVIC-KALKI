require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generates priority and routing recommendations for a submitted entity/grievance.
 * @param {string} description - The entity description or grievance details.
 * @returns {Promise<string>} AI-generated priority level and concise reasoning.
 */
async function generateAISuggestion(description) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `A citizen submitted this grievance/entity: "${description}". Suggest an appropriate priority level (Low/Medium/High) and provide a concise one-line reasoning.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
}

module.exports = { generateAISuggestion };