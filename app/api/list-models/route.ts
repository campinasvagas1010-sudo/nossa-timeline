import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Sem API Key no .env" }, { status: 500 });
  }

  try {
    // Chamada direta à API REST do Google para listar modelos
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: "GET" }
    );

    const data = await response.json();

    // Se a API retornar erro (ex: chave inválida)
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    // Filtra apenas os nomes para facilitar a leitura
    const modelNames = data.models?.map((m: any) => m.name) || [];

    return NextResponse.json({
      success: true,
      total_models: modelNames.length,
      available_models: modelNames,
      full_response: data // Mantenho o dado completo caso queira ver detalhes
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
