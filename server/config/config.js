// PUERTO
process.env.PORT = process.env.PORT || 8080;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
// process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30 * 1000;
process.env.EXPIRES_TOKEN = '24h';


// Seed
process.env.SEED = process.env.SEED || 'hola-mundito';

// Base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://rest-mongo:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '444426041757-8l80laguq9624aubfjumbflfmbaahgfj.apps.googleusercontent.com'