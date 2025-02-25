import fs from 'fs';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

// Función para cargar el token desde token.json
function loadAccessToken() {
  if (fs.existsSync('token.json')) {
    const tokens = JSON.parse(fs.readFileSync('token.json', 'utf-8'));
    return tokens.access_token;
  } else {
    throw new Error('Error: No se encontró el archivo token.json');
  }
}

// Función para refrescar el token si ha expirado
async function refreshAccessToken(auth: any) {
  const tokens = JSON.parse(fs.readFileSync('token.json', 'utf-8'));
  if (tokens.expiry_date && tokens.expiry_date < Date.now()) {
    const newTokens = await auth.refreshAccessToken();
    fs.writeFileSync('token.json', JSON.stringify(newTokens.credentials));
    return newTokens.credentials.access_token;
  }
  return tokens.access_token;
}

const BLOG_ID = '3182791542012624017';

export async function POST(req: Request) {
  try {
    const { title, content } = await req.json();
    const accessToken = loadAccessToken();

    // Configurar autenticación con el token cargado
    const auth = new google.auth.OAuth2();
    auth.setCredentials({ access_token: accessToken });

    // Verificar si el token ha expirado y refrescarlo si es necesario
    const validAccessToken = await refreshAccessToken(auth);
    auth.setCredentials({ access_token: validAccessToken });

    const blogger = google.blogger({ version: 'v3', auth });

    // Publicar en Blogger
    const response = await blogger.posts.insert({
      blogId: BLOG_ID,
      requestBody: {
        title,
        content,
      },
    });

    return NextResponse.json({
      message: 'Post publicado con éxito',
      url: response.data.url,
      id: response.data.id,
    });
  } catch (error) {
    console.error('Error al publicar en Blogger:', error);
    return NextResponse.json(
      { error: 'No se pudo publicar en Blogger' },
      { status: 500 }
    );
  }
}
