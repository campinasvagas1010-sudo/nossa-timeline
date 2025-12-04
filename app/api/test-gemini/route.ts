import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chave não encontrada" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // ATUALIZADO: Usando um modelo que confirmamos que você tem acesso
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = "Responda apenas: A API Gemini 2.0 está conectada!";
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ success: true, message: text });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
