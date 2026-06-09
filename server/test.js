import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function testGenerate() {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const modelsToTest = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash-lite'];

    for (let model of modelsToTest) {
        console.log(`Testing model: ${model}...`);
        try {
            const response = await ai.models.generateContent({
                model: model,
                contents: 'Write a 10 word story about a dog.',
            });
            console.log(`SUCCESS with ${model}:`, response.text);
            return; // Stop if successful
        } catch (e) {
            console.error(`FAILED with ${model}:`, e.message || e);
        }
    }
}
testGenerate();
