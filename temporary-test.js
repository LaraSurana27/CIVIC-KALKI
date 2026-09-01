require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });
    const prompt = 'A citizen submitted this grievance: "The streetlight near Sector 5 park has been broken for 3 weeks." Suggest a priority level (Low/Medium/High) and a one-line reasoning.';
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
}

run().catch(console.error);