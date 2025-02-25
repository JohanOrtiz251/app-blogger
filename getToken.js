import { google } from 'googleapis';
import readline from 'readline';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// Validar que las variables de entorno existen
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, REDIRECT_URI } = process.env;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !REDIRECT_URI) {
  throw new Error('❌ ERROR: Faltan variables de entorno en .env');
}

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);

// Generar URL de autenticación
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/blogger'],
  response_type: 'code',
});

console.log('🔗 Visita esta URL para autorizar:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Introduce el código de autorización: ', async code => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    console.log('✅ Token obtenido:', tokens);
  } catch (error) {
    console.error('❌ Error al obtener el token:', error);
  } finally {
    rl.close();
  }
});
