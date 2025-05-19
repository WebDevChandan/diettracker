import { GoogleGenAI } from '@google/genai';

const geminiClientSingleton = () => {
    return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

declare global {
    var geminiGlobal: undefined | ReturnType<typeof geminiClientSingleton>
}

const ai = globalThis.geminiGlobal ?? geminiClientSingleton()

export default ai

if (process.env.NODE_ENV !== 'production') globalThis.geminiGlobal = ai