import fs from 'fs';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

const TOKEN_PATH = 'token.json';
const CLIENT_ID =
  '956505244552-t3gs0g12trtmuqd6fe21gevsld4mm2er.apps.googleusercontent.com'; // Reemplázalo con tu Client ID
const CLIENT_SECRET = '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'; // Reemplázalo con tu Client Secret
const BLOG_ID = '3182791542012624017';

// Cargar y refrescar el token si es necesario
async function getAccessToken() {
  if (!fs.existsSync(TOKEN_PATH)) {
    throw new Error('Error: No se encontró el archivo token.json');
  }

  const tokens = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf-8'));
  const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);

  oauth2Client.setCredentials(tokens);

  // Verificar si el token ha expirado
  const now = Date.now();
  if (tokens.expiry_date && now >= tokens.expiry_date) {
    console.log('Access token expirado, renovando...');
    const { credentials } = await oauth2Client.refreshAccessToken();
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(credentials, null, 2));
    console.log('Nuevo access token guardado.');
    return credentials.access_token;
  }

  return tokens.access_token;
}

export async function POST(req) {
  try {
    const { title, content } = await req.json();
    const accessToken = await getAccessToken();

    const auth = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
    auth.setCredentials({ access_token: accessToken });

    const blogger = google.blogger({ version: 'v3', auth });

    // Publicar en Blogger
    const response = await blogger.posts.insert({
      blogId: BLOG_ID,
      requestBody: { title, content },
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
