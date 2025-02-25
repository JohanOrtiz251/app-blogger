import fs from 'fs';
import { google } from 'googleapis';
import readline from 'readline';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env
dotenv.config();

// Cargar credenciales desde credentials.json
const credentials = JSON.parse(fs.readFileSync('credenciales11.json', 'utf-8'));

const REDIRECT_URI = process.env.REDIRECT_URI;
if (!REDIRECT_URI) {
  throw new Error(
    '❌ ERROR: REDIRECT_URI no está definido en las variables de entorno'
  );
}

const oauth2Client = new google.auth.OAuth2(
  credentials.installed.client_id,
  credentials.installed.client_secret,
  REDIRECT_URI
);

// Generar URL de autenticación
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/blogger'],
  response_type: 'code', // IMPORTANTE
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
    fs.writeFileSync('token1.json', JSON.stringify(tokens));
    console.log('✅ Token guardado en token1.json');
  } catch (error) {
    console.error('❌ Error al obtener el token:', error);
  } finally {
    rl.close();
  }
});
