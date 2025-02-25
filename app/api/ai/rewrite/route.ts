import { NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const LEXICA_API_URL = 'https://lexica.art/api/v1/search'; 

export async function POST(req: Request) {
  try {
    const { content, generateImage } = await req.json();

    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY no está configurada');
    }

    // Paso 1: Reescribir el contenido con IA
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content:
              'Eres un editor experto que reescribe artículos manteniendo la información clave pero mejorando el estilo y la estructura. También genera un resumen y puntos clave en el mismo texto.',
          },
          {
            role: 'user',
            content: `Reescribe el siguiente contenido en español, haciéndolo más atractivo y fácil de leer, manteniendo los datos importantes. Al final del texto, añade un resumen y una lista de puntos clave: ${content}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    const data = await response.json();
    if (!data.choices || !data.choices[0].message?.content) {
      throw new Error('No se recibió respuesta del modelo');
    }
    const rewrittenContent = data.choices[0].message.content;

    // Paso 2: Generar imagen si se solicita
    let imageUrl = null;
    if (generateImage) {
      const imageResponse = await fetch(
        `${LEXICA_API_URL}?q=${encodeURIComponent(content)}`
      );
      const imageData = await imageResponse.json();

      if (imageData.images && imageData.images.length > 0) {
        imageUrl = imageData.images[0].src; // Tomamos la primera imagen generada
      }
    }

    return NextResponse.json({ rewrittenContent, imageUrl });
  } catch (error) {
    console.error('Error en el proceso:', error);
    return NextResponse.json(
      { error: 'No se pudo procesar la solicitud' },
      { status: 500 }
    );
  }
}
