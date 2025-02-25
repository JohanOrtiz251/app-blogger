import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      title,
      content,
      platform,
    }: {
      title: string;
      content: string;
      platform: 'facebook' | 'twitter' | 'linkedin';
    } = await req.json();

    const prompts: Record<'facebook' | 'twitter' | 'linkedin', string> = {
      facebook:
        'Crea una publicación atractiva para Facebook que promocione este artículo. Incluye emojis relevantes y un llamado a la acción.',
      twitter:
        'Crea un tweet atractivo que promocione este artículo. Usa hashtags relevantes y mantén el límite de caracteres.',
      linkedin:
        'Crea una publicación profesional para LinkedIn que promocione este artículo. Enfócate en el valor empresarial y profesional.',
    };

    const result = await streamText({
      model: openai('gpt-4'),
      messages: [
        {
          role: 'system',
          content: 'Eres un experto en marketing de redes sociales.',
        },
        {
          role: 'user',
          content: `
            Título del artículo: ${title}
            Contenido: ${content}

            ${prompts[platform]}
          `,
        },
      ],
    });

    const response = await result.text;

    return NextResponse.json({ content: response });
  } catch (error) {
    console.error('Error al generar contenido social:', error);
    return NextResponse.json(
      { error: 'No se pudo generar el contenido social' },
      { status: 500 }
    );
  }
}
