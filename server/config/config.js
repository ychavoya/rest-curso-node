// PUERTO
process.env.PORT = process.env.PORT || 8080;

// Entorno
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Vencimiento del token
process.env.EXPIRES_TOKEN = 60 * 60 * 24 * 30 * 1000;

// Seed
process.env.SEED = process.env.SEED || 'hola-mundito';

// Base de datos
let urlDB;

if(process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;